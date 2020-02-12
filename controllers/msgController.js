/**
 * msgController.js includes all functions for handling all incoming messages.
 */
// request is a module to handle http request
const request = require('request');
const SearchController = require('./searchController');

/**
 * Handle incoming message and commands
 * @param message : Object Discord bot incoming message
 * @return output message: Reply to same channel using discord send function
 */
exports.dispatcher = message => {
  // complete input message: !google nodejs
  inputMessage = message.content;
  if (inputMessage === 'ping') return message.channel.send('pong');

  // Task: bot reply hey when user input hi
  if (inputMessage.toLowerCase() === 'hi') return message.channel.send('hey');

  if (inputMessage.toLowerCase() === 'help') return message.channel.send({
    embed: defaultReply()
  });

  // checking if first character in incoming message is !, if yes then proceed further
  if (inputMessage.indexOf('!') === 0) {
    // split input message into command and args: !google nodejs -> ['!google', 'nodejs]
    args = inputMessage.split(' ');

    // remove ! from the first args: !google -> google
    command = args[0].substring(1);

    // remove command from args: ['!google', 'nodejs] -> ['nodejs']
    args.splice(0, 1);

    // lowercasing first argument so that it works for Google or google
    command = command.toLowerCase();
    switch (command) {
      // !google nodejs tutorials
      case 'google':
        // storing user searches in mongodb asynchronously
        SearchController.create(
          message.author.id,
          args.join(' ').toLowerCase()
        );

        // sending request to google custom search engine (google.com) api
        request.get({
            uri: process.env.GOOGLE_CSE_URL,
            qs: {
              q: args.join(' ') // sending args as string: ['nodejs','tutorials'] -> nodejs tutorials
            }
          },
          (err, res) => {
            // handling error
            if (err)
              return message.channel.send('Error in searching on Google');

            parsedBody = JSON.parse(res.body);
            // checking if search results are found of google
            if (parseInt(parsedBody['searchInformation']['totalResults']) == 0)
              return message.channel.send('No results found on google');

            embed = {
              title: `Searched term: ${args.join(' ')}`,
              fields: []
            };

            // parsing google api response to get links and title
            for (index in parsedBody['items']) {
              embed['fields'].push({
                name: parsedBody['items'][index]['title'],
                value: `[${parsedBody['items'][index]['displayLink']}](${parsedBody['items'][index]['link']})`
              });
              // showing only 5 results
              if (index == 4) break;
            }

            return message.channel.send({
              embed: embed
            });
          }
        );
        break;

        // !recent nodejs
      case 'recent':
        // finding top 10 recent searches which contains the incoming message term
        // for getting results from this query we have to wait and hence we are using promises.
        const results = SearchController.find(
          message.author.id,
          args.join(' ')
        );
        results.then(data => {
          embed = {
            title: `${data.length} Results found`,
            fields: []
          };

          // handling condition of no results
          if (data.length) {
            for (key in data) {
              embed.fields.push({
                name: data[key]['search_term'],
                value: '\u200b'
              });
            }
          }
          return message.channel.send({
            embed: embed
          });
        });

        break;

      default:
        message.channel.send(
          "I didn't get what you are looking for, following are the things which I can do."
        );
        return message.channel.send({
          embed: defaultReply()
        });

        break;
    }
  } else {
    message.channel.send(
      "I didn't get what you are looking for, following are the things which I can do."
    );
    return message.channel.send({
      embed: defaultReply()
    });
  }
};

/**
 * return default reply in case incoming message didn't match any command
 */
defaultReply = () => {
  return {
    title: 'Help',
    fields: [{
        name: 'hi-hey',
        value: 'I can reply Hey! when you type Hi'
      },
      {
        name: 'Search google for top 5 results',
        value: 'Type !google "your search term" (eg.!google tech news) and I will give you top 5 results from google.com.'
      },
      {
        name: 'Search your searched term history',
        value: 'Type !recent "search phrase" (eg.!recent tech)" and I will give your recent 10 searches which includes that search term.'
      },
      {
        name: 'Get recent 10 searches',
        value: 'Type !recent or !recent all and I will give you top 10 recent searches.'
      }
    ]
  };
};