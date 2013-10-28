var recipe = angular.module('reader', []);

recipe.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when('/', {templateUrl: 'title.html', controller: "TitleCtrl"}).
                when('/contact', {templateUrl: 'contact.html', controller: "ContactCtrl"}).
                when('/feeds', {templateUrl: 'feed.html', controller: "FeedCtrl"}).
                when('/feeds/:feedId', {templateUrl: 'feed.html', controller: "FeedCtrl"}).
                when('/addfeed', {templateUrl: 'addfeed.html', controller: "FeedAddCtrl"}).
//                when('/view/:recipeId', {templateUrl: 'client/view.html', controller: ViewCtrl, reloadOnSearch: false}).
//                when('/add/', {templateUrl: 'client/edit.html', controller: AddCtrl}).
//                when('/edit/:recipeId', {templateUrl: 'client/edit.html', controller: EditCtrl}).
//                when('/profile/', {templateUrl: 'client/profile.html', controller: ProfileCtrl}).
//                when('/confirm/', {templateUrl: 'client/list.html', controller: ConfirmCtrl}).
                otherwise({redirectTo: '/'});
    }]);

recipe.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
    });
});

recipe.factory('$webservices', function ($http) {
    var callServer = function (path, data, successCallback) {
        $http({method: 'POST',
            url: path,
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            successCallback(data);
        }).error(function (data, status, headers, config) {
            console.log("Error: " + data);
        });
    };

    return {
        contact: function (name, email, message, callback) {
            callServer("/contact", {name: name, email: email, message: message}, function(data) {
                callback(data.msg);
            });
        },
        listFeeds: function (callback) {
            callServer("/feeds", {cmd: "listFeeds"}, function (data) {
                callback(data);
            });
        },
        listFeedItems: function (id, callback) {
            callServer("/feeds", {cmd: "getFeedItems", id: id}, function (data) {
                callback(data);
            });
        }
    };
});

recipe.controller("TitleCtrl", function () {

});

recipe.controller("ContactCtrl", function ($scope, $webservices) {
    $scope.contact = {};

    $scope.contact.submit = function () {
        //TODO: add field validation

        var contact = $scope.contact;
        $webservices.contact(contact.name, contact.email, contact.message, function (msg) {
            alert(msg);
        });
    };
});

recipe.controller("FeedCtrl", function ($scope, $webservices, $routeParams) {
    $scope.feeds = {};
    $scope.feedItems = {};
    $scope.activeFeed = $routeParams.feedId;

    $webservices.listFeeds(function (data) {
        console.dir(data);
        $scope.feeds = data;
    });

    if ($scope.activeFeed != null) {
        $webservices.listFeedItems($scope.activeFeed, function(data)  {
            console.dir(data);
            $scope.feedItems = data;
        });
    }
    
    angular.element(".sidebar").affix();
});

recipe.controller("FeedAddCtrl", function ($scope, $webservices) {
    
})