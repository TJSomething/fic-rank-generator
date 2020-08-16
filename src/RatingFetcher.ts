import { JSDOM } from 'jsdom';
import { Fic } from './Fic';

export async function getNasuFicRecThreadUrl(): Promise<string> {
  const indexDOM = await JSDOM.fromURL(
    'https://forums.spacebattles.com/forums/the-index.63/?tags[0]=nasuverse',
  );
  const threadLinks = indexDOM.window.document.querySelectorAll(
    '.block-body .structItem-title a',
  );
  const threadLink = (Array.from(threadLinks) as HTMLAnchorElement[]).find(
    (link) => link.href.indexOf('fic-rec') !== -1,
  );
  if (!threadLink) {
    throw new Error('thread not found');
  }

  return threadLink.href;
}

export async function getRecommendationListThreadmarks(
  threadUrl: string,
): Promise<ReadonlyArray<string>> {
  const threadPage1 = await JSDOM.fromURL(threadUrl);
  const threadmarkLinks = threadPage1.window.document.querySelectorAll(
    '.block-outer-main--threadmarks .menu-content a',
  );
  const recListLinks = (Array.from(
    threadmarkLinks,
  ) as HTMLAnchorElement[]).filter(
    (link) => link.textContent
    && link.textContent.indexOf('Recommendation List') !== -1,
  );
  if (recListLinks.length === 0) {
    throw new Error('recommendation lists not found');
  }
  // Remove duplicates
  return [...new Set(recListLinks.map((link) => link.href))];
}

// Wilson score function by:
// https://github.com/msn0/wilson-score-interval
function lowerWilsonScore(up: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  // phat is the proportion of successes
  // in a Bernoulli trial process
  const phat = up / total;

  // z is 1-alpha/2 percentile of a standard
  // normal distribution for error alpha=15%
  const z = 1.28;

  // implement the algorithm
  // (http://goo.gl/kgmV3g)
  const a = phat + (z * z) / (2 * total);
  const b = z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * total)) / total);
  const c = 1 + (z * z) / total;

  return (a - b) / c;
}

export async function extractFics(threadmarkUrl: string): Promise<ReadonlyArray<Fic>> {
  const recListPage = await JSDOM.fromURL(threadmarkUrl);
  const updateTime = recListPage.window.document.querySelector(
    '.hasThreadmark[data-author="Gashadokuro Amanojaku"] .message-lastEdit time',
  ) as HTMLTimeElement | undefined;
  if (!updateTime) {
    throw new Error('invalid update time');
  }
  const ficBoxes = Array.from(
    recListPage.window.document.querySelectorAll(
      '.hasThreadmark[data-author="Gashadokuro Amanojaku"] .bbCodeSpoiler-content .bbCodeBlock-expandContent',
    ),
  ).filter(
    (el) => el.textContent
    && el.textContent.match(/Standing: *(\+[0-9]+)\|(-[0-9]+)/) !== null,
  );

  return ficBoxes.map((el) => {
    const { textContent } = el;
    if (!textContent) {
      throw new Error('post parsing error');
    }
    const match = textContent.match(/Standing: *(\+[0-9]+)\|(-[0-9]+)/);
    if (!match) {
      throw new Error('post parsing error');
    }
    const [, recStr, derecStr] = match;
    const recommendations = Number(recStr);
    const derecommendations = -Number(derecStr);
    const total = recommendations + derecommendations;
    const netRecommendations = recommendations - derecommendations;
    const score = lowerWilsonScore(recommendations, total);
    const title = textContent.split('\n')[1].trim();
    const firstLink = el.querySelector('a')?.href;
    const url = firstLink === 'http://' ? null : firstLink;
    return {
      title,
      recommendations,
      derecommendations,
      netRecommendations,
      score,
      url,
      textBody: textContent.trim(),
      htmlBody: el.innerHTML,
    } as Fic;
  });
}

export async function getFics(): Promise<ReadonlyArray<Fic>> {
  const threadUrl = await getNasuFicRecThreadUrl();
  const recListUrls = await getRecommendationListThreadmarks(threadUrl);
  const fics: Fic[] = [];
  for (const url of recListUrls) {
    const pageFics = await extractFics(url);
    fics.push(...pageFics);
  }
  fics.sort((a, b) => b.score - a.score);

  return fics;
}
