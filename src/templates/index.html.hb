<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Nasu Fic Recommendation Leaderboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
  </head>
  <body>
    <div class="container">
      <h1>Nasu Fic Rec Leaderboard</h1>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Recs</th>
            <th scope="col">De-recs</th>
            <th scope="col">Net recs</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {{#each data}}
            <tr>
              <th scope="row">
                {{#if url}}
                  <a href="{{url}}">{{title}}</a>
                {{else}}
                  {{title}}
                {{/if}}
              </th>
              <td>{{recommendations}}</td>
              <td>{{derecommendations}}</td>
              <td>{{netRecommendations}}</td>
              <td>{{round score 3}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
      <p>
        This table was generated by <a href="https://forums.spacebattles.com/members/tjsomething.110787/">TJSomething</a> from the <a
        href="https://forums.spacebattles.com/threads/nasu-fic-rec-and-fic-discussion-thread-3-not-an-idea-thread.301761/">SpaceBattles
        Forums Nasu Fic Rec and Fic Discussion thread</a>, using the threadmarked recommendation lists maintained
        by <a
        href="https://forums.spacebattles.com/members/gashadokuro-amanojaku.451312/">Gashadokuro
        Amanojaku</a>.
      </p>
      <p>
        This page was last updated at {{date}}.
      </p>
    </div>
  </body>
</html>
