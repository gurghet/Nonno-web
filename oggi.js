(function (global) {
    'use strict';

    var nonnoApp = global.angular.module('nonnoApp', ['ngRoute', 'ngSanitize', 'ngTouch']);

    nonnoApp.filter('stripHTML', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }
		   );

    nonnoApp.filter('stripnbsp', function() {
	return function(text) {
	    return String(text).replace(/&nbsp;/, ' ');
	};
    });
    
    nonnoApp.factory('fetchFeedIlGiornale', ['$http', function($http) {
	return {
	    getEntries: function () {
		var promise = $http.jsonp(
		    '//ajax.googleapis.com/ajax/services/feed/load?'
			+ 'v=1.0&num=5&callback=JSON_CALLBACK&'
			+ 'q=http://www.ilgiornale.it/feed.xml'
		);
		return promise;
	    }
	};
    }]);
					     
    nonnoApp.factory('fetchFeedFatto', ['$http', function ($http) {
        var tags,
            pubtags,
            entries,
            checkedEntries,
            j;
        return {
            getEntries: function () {
                var promise = $http.jsonp(
                    '//ajax.googleapis.com/ajax/services/feed/load?'
                        + 'v=1.0&num=100&callback=JSON_CALLBACK&'
                        + 'q=http://www.ilfattoquotidiano.it/feed/'
                );
                return promise;
            },
            getTags: function () {
                var promise = this.getEntries().success(function (data) {
                    var tag, entry, tagKey, i;
                    entries = data.responseData.feed.entries;
                    tags = {};
                    pubtags = [];
                    checkedEntries = [];
                    for (i = 0; i < entries.length; i += 1) {
                        entry = entries[i];
                        for (j = 0; j < entry.categories.length; j += 1) {
                            if (tags.hasOwnProperty(entry.categories[j])) {
                                tags[entry.categories[j]].count += 1;
                            } else {
                                tags[entry.categories[j]] = {
                                    count: 1,
                                    entries: [],
                                    name: entry.categories[j]
                                };
                            }
                            tags[entry.categories[j]].entries.push(entry);
                        }
                    }
                    for (tagKey in tags) {
                        if (tags.hasOwnProperty(tagKey)) {
                            tag = tags[tagKey];
                            if (tag.count > 0) {
                                for (i = tag.entries.length - 1; i >= 0; i -= 1) {
                                    entry = tag.entries[i];
                                    if (checkedEntries.indexOf(entry.title) > -1) {
                                        tag.entries.splice(i, 1);
                                    } else {
                                        checkedEntries.push(entry.title);
                                    }
                                }
                                if (tag.entries.length > 0) {
                                    pubtags.push(tag);
                                }
                            }
                        }
                    }
                    data.responseData.pubtags = pubtags;
                });
                return promise;
            }
        };
    }]);

    nonnoApp.controller('FeedController',
                        function ($scope, $routeParams, fetchFeedFatto, fetchFeedIlGiornale, $location, $anchorScroll, $timeout, $rootScope) {
			     fetchFeedFatto.getTags().then(function (promise) {
				 var pubtags = promise.data.responseData.pubtags;
				 $scope.tags = pubtags;
				 if ($routeParams.id !== 'undefined') {
				     $scope.tag = pubtags[$routeParams.id];
				 }
			     });
			     fetchFeedIlGiornale.getEntries().success(function (data) {
				 var entries = data.responseData.feed.entries;
				 $scope.gentries = entries;
				 $location.hash($rootScope.lastViewedElement);
				 $timeout(function () {
				     $anchorScroll();				     
				 }, 250);
			     });
			 });

    nonnoApp.controller('ArticoloGiornaleController',
			['$scope', '$routeParams', 'fetchFeedIlGiornale', '$rootScope',
			 function ($scope, $routeParams, fetchFeedIlGiornale, $rootScope) {
			     fetchFeedIlGiornale.getEntries().then(function (promise) {
				 var gentry,
				     gentries = promise.data.responseData.feed.entries;
				 gentry = gentries[$routeParams.index];
				 $scope.title = gentry.title;
				 $scope.content = gentry.content;
				 $rootScope.lastViewedElement = "gg" + $routeParams.index; 
			     });
			 }]);
    
    nonnoApp.controller('ArticoloController',
                        ['$scope', '$routeParams', 'fetchFeedFatto',
                         function ($scope, $routeParams, fetchFeedFatto) {
			     fetchFeedFatto.getEntries().then(function (promise) {
				 var entry,
				     entries = promise.data.responseData.feed.entries,
				     i;
				 for (i = 0; i < entries.length; i += 1) {
				     if (entries[i].title === $routeParams.title) {
					 entry = entries[i];
					 break;
				     }
                    }
                    $scope.title = entry.title;
                    $scope.content = entry.content;
                });
            }]);
    
    nonnoApp.controller('TvController',
                        ['$scope', '$routeParams', '$http', '$rootScope',
			 function ($scope, $routeParams, $http, $rootScope) {
                 var nomeCanale = [
					'Questo canale non esiste',
                     'Rai Uno',
                     'Rai Due',
                     'Rai Tre',
                     'Rete 4',
                     'Canale 5',
                     'Italia 1',
                     'La 7',
                     'RaiSport 1',
                     'RaiSport 2',
                     'Rai Storia',
                     'Dmax',
                     'Focus'
                 ];
                 if (!isNaN($routeParams.chan)) {
                     $scope.canale = nomeCanale[$routeParams.chan];

                     var responsePromise = $http.jsonp("http://polar-inlet-3993.herokuapp.com/users/" + $routeParams.chan + "?callback=JSON_CALLBACK");

                     responsePromise.success(function(data, status, headers, config) {
                         $scope.plan = data.plan;
                     });
                     responsePromise.error(function(data, status, headers, config) {
                         alert("ERRORE: il sistema non risponde!");
                     });
                 }
            }]);
    
    nonnoApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                controller: 'FeedController',
                templateUrl: 'tags.html'
            }).
            when('/articolo/:title', {
                controller: 'ArticoloController',
                templateUrl: 'articolo.html'
            }).
	    when('/ig/:index', {
		controller: 'ArticoloGiornaleController',
		templateUrl: 'articoloilgiornale.html'
	    }).
            when('/tag/:id', {
                controller: 'FeedController',
                templateUrl: 'feed.html'
            }).

            when('/tv', {
                templateUrl: 'guidatv.html'
            }).
            when('/canale/:chan', {
                controller: 'TvController',
                templateUrl: 'canale.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
}(this));
