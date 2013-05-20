var app = angular.module('app', []);
app.value('$', $);
app.factory('stockTickerData', ['$', '$rootScope', function ($, $rootScope) {
    function stockTickerOperations() {
        //Objects needed for SignalR
        var connection;
        var proxy;

        //To set values to fields in the controller
        var setMarketState;
        var setValues;
        var updateStocks;

        var setCallbacks = function (setMarketStateCallback, setValuesCallback, updateStocksCallback) {
            setMarketState = setMarketStateCallback;
            setValues = setValuesCallback;
            updateStocks = updateStocksCallback;
        };

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
                $rootScope.$apply(setMarketState(true));
            });

            proxy.on('marketClosed', function () {
                //set market state as closed
                $rootScope.$apply(setMarketState(false));
            });

            proxy.on('marketReset', function () {
                //Reset stock values
                initializeStockMarket();
            });

            proxy.on('updateStockPrice', function (stock) {
                $rootScope.$apply(updateStocks(stock));
            });
        };

        var initializeStockMarket = function () {
            //Getting values of stocks from the hub and setting it to controller's field
            proxy.invoke('getAllStocks').done(function (data) {
                $rootScope.$apply(setValues(data));
            }).pipe(function () {
                //Setting market state to field in controller based on the current state
                proxy.invoke('getMarketState').done(function (state) {
                    if (state == 'Open')
                        $rootScope.$apply(setMarketState(true));
                    else
                        $rootScope.$apply(setMarketState(false));
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
            reset: reset,
            setCallbacks: setCallbacks
        }
    };

    return stockTickerOperations;
} ]);