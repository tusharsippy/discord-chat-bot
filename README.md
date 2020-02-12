# Discord Chat Bot

Blue chatbot is a discord chatbot which can do the following things:

- Type help to see what bot can do.
- The bot can reply Hey! when you type Hi
- Type !google "your search term" (eg.!google tech news) and the bot will give you top 5 results from google.com
- Type !recent "search phrase" (eg.!recent tech)" and the bot will give your recent 10 searches which includes that search term
- Type !recent or !recent all to get recent 10 searches

## Example commands

- help
- hi -> Hey
- ping -> pong
- Google Search
  - !google nodejs
  - !google apple games
  - !google game of thrones
- Recent Search History
  - !recent or !recent all (get top 10 recent searches)
  - !recent game (get top 10 recent searches which include keyword "game".For above searches it will return apple games and game of thrones)

## Google Search Process

- user-input message !google tech news
- searched term (tech news) will be saved in MongoDB
- bot search on google.com (tech news) using google custom search engine API
- top 5 results will be returned as a reply
- if an error occurs then bot reply: Error in searching on Google
- if no results found then bot reply: No results found on google

## Recent Search Process

- user input !recent news
- bot search in MongoDB collection for a particular searched term (news) and author id
- if no results found then bot reply: 0 Results found
- if results found then it will return recent 10 searches(here, tech news)
- search is case insensitive

## Special Cases

- type ping and get pong
- type Hi and get hey
- type anything gibberish eg. qwertyui and you will get help section as a reply

## File Structure

- root

  - controllers (contains all logics files)
    - msgController.js (logic related to command and input messages)
    - searchController.js (for saving and finding recent searches)
  - models (contains all database interaction files)
    - Search.js (search model schema)
  - sample.env (dummy values for settings)
  - index.js (root file to start server)

  ## Screenshots

![image](http://tusharsharma.in/images/chat-bot-help.png)
![image](http://tusharsharma.in/images/chat-bot-google-search.png)
![image](http://tusharsharma.in/images/chat-bot-recent-searches.png)
![image](http://tusharsharma.in/images/chat-bot-all-recent-searches.png)
