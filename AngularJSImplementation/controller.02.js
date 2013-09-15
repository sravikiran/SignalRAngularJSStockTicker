var StockTickerCtrl = function ($scope, stockTickerData) {

    $scope.stocks = [];
    $scope.marketIsOpen = false;

    $scope.openMarket = function () {
        stockTickerData.openMarket();
    }

    $scope.closeMarket = function () {
        stockTickerData.closeMarket();
    }

    $scope.reset = function () {
        stockTickerData.reset();
    }

    function assignStocks(stocks) {
        $scope.stocks = stocks;
    }

    function replaceStock(stock) {
        for (var count = 0; count < $scope.stocks.length; count++) {
            if ($scope.stocks[count].Symbol == stock.Symbol) {
                $scope.stocks[count] = stock;
            }
        }
    }

    function setMarketState(isOpen) {
        $scope.marketIsOpen = isOpen;
    }

    //    var ops = stockTickerData();
    //    ops.setCallbacks(setMarketState, assignStocks, replaceStock);
    stockTickerData.initializeClient();

    $scope.$parent.$on('marketOpened', function (e, status) {
        $scope.$apply(function () {
            setMarketState(status);
        });
    });

    $scope.$parent.$on('marketClosed', function (e, status) {
        $scope.$apply(function () {
            setMarketState(!status);
        });
    });

    $scope.$parent.$on('updateStock', function (e, stock) {
        $scope.$apply(function () {
            replaceStock(stock);
        });
    });

    $scope.$parent.$on('setStocks', function (e, stocks) {
        $scope.$apply(function () {
            assignStocks(stocks);
        });
    });
}