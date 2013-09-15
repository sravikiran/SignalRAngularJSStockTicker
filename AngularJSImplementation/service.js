var app = angular.module('app', []);
app.value('$', $);
app.service('stockTickerData', ['$', '$rootScope', function ($, $rootScope) {

    //Objects needed for SignalR
    var connection;
    var proxy;

    //To set values to fields in the controller
    var setMarketState;
    var setValues;
    var updateStocks;

    var initializeClient = function () {
        //Creating connection and proxy objects
        connection = $.hubConnection();
        proxy = connection.createHubProxy('stockTicker');

        configureProxyClientFunctions();

        start();
    };

    var configureProxyClientFunctions = function () {
        proxy.on('marketOpened', function () {
            //set market state as open
            //$rootScope.$apply(setMarketState(true));
            $rootScope.$emit('marketOpened', true);
        });

        proxy.on('marketClosed', function () {
            //set market state as closed
            //$rootScope.$apply(setMarketState(false));
            $rootScope.$emit('marketClosed', true);
        });

        proxy.on('marketReset', function () {
            //Reset stock values
            initializeStockMarket();
        });

        proxy.on('updateStockPrice', function (stock) {
            //$rootScope.$apply(updateStocks(stock));
            $rootScope.$emit('updateStock', stock);
        });
    };

    var initializeStockMarket = function () {
        //Getting values of stocks from the hub and setting it to controller's field
        proxy.invoke('getAllStocks').done(function (data) {
            //$rootScope.$apply(setValues(data));
            $rootScope.$emit('setStocks', data);
        }).pipe(function () {
            //Setting market state to field in controller based on the current state
            proxy.invoke('getMarketState').done(function (state) {
                if (state == 'Open') {
                    //$rootScope.$apply(setMarketState(true));
                    $rootScope.$emit('marketOpened', true);
                }
                else {
                    //$rootScope.$apply(setMarketState(false));
                    $rootScope.$emit('marketClosed', true);
                }
            });
        });
    };

    var start = function () {
        //Starting the connection and initializing market
        connection.start().pipe(function () {
            initializeStockMarket();
        });
    };

    var openMarket = function () {
        proxy.invoke('openMarket');
    };

    var closeMarket = function () {
        proxy.invoke('closeMarket');
    };

    var reset = function () {
        proxy.invoke('reset');
    };

    return {
        initializeClient: initializeClient,
        openMarket: openMarket,
        closeMarket: closeMarket,
        reset: reset
    };
}
]);