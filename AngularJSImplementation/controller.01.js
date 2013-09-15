var StockTickerCtrl = function ($scope, stockTickerData) {

    $scope.stocks = [];
    $scope.marketIsOpen = false;

    $scope.openMarket = function () {
        ops.openMarket();
    }

    $scope.closeMarket = function () {
        ops.closeMarket();
    }

    $scope.reset = function () {
        ops.reset();
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

    var ops = stockTickerData();
    ops.setCallbacks(setMarketState, assignStocks, replaceStock);
    ops.initializeClient();
}