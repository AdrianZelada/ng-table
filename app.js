angular.module('app',[]).controller('MainCtrl',function($scope,$http){
		
	$http.get('http://jsonplaceholder.typicode.com/comments').then(function(respo){
		$scope.data=respo.data;
	});

});

// angular.module('app').directive('tableSir', [function () {
// 	return {
// 		restrict: 'A',
// 		scope:{
// 			tabledata:'=tabledata'
// 		},
// 		controller:function($scope,$element,$attrs,$filter){
// 			var auxData=null;
// 			var orderBy=$filter('orderBy');

// 			$scope.order=function(){
// 				console.log("order");
// 				$scope.tabledata=orderBy($scope.tabledata,"name",false);

// 				$scope.$apply();
// 			}

// 			$scope.$watch('tabledata',function(newValue,oldValue){
// 				if(newValue!=old Value){
// 					if(auxData==null){																						
// 						$scope.tabledata=orderBy($scope.tabledata,"name",false);
// 						auxData=$scope.tabledata;
// 						$scope.tabledata=auxData.slice(0,10);
// 					}				
// 				}
// 			});

// 		},
// 		link: function (scope, iElement, iAttrs) {
// 			var table=angular.element(iElement)[0];
// 			// console.log(table);
// 			if(table.tagName==="TABLE"){
// 				var thead=$(table).children()[0];			
// 				if($(thead).children()[0].tagName==="TR"){										
// 					var childrenTH=$(thead).children()[0].children;					
// 					EachDom(childrenTH[0],0);
// 				}				
// 			}
// 			function EachDom(children){				
// 				if(children!= undefined ) {
// 					children.onclick=function(){
// 						// console.dir(children);
// 						console.log(table.nextSibling.nextSibling);
// 						scope.order();
// 					}					
// 					EachDom(children.nextSibling);
// 				}
// 			}
// 		}
// 	};
// }])