/**
 * Created by zeladaa on 18-08-15.
 */
//<table table-directive tabledata="data" filter="nombre">
//

angular.module('epsasAngJsApp').factory('tableFactory',function(){
//
//    function tableFactory(data){
//        this.data=data;
//    }

    return{
        data:null,
        setData:function(data){
            this.data=data;
        }
    }
}).directive('tableDirective',function($compile){
    return{
        restrict:'A',
        scope:{
            tabledata:'=tabledata',
            filter:'=filter'
        },
        controller:function($scope,$filter,tableFactory,$element){
            var orderBy=$filter('orderBy');
            var auxData=null;
            $scope.formSorting=true;

            var navigation=angular.element('<nav>\
                                                <ul class="pagination"></ul>\
                                            </nav>');
            navigation=navigation[0].children[0];

            $scope.sorting=function(attr){
                $scope.tabledata=orderBy($scope.tabledata,attr,$scope.formSorting);
                $scope.$apply();
            }

            $scope.$watch('tabledata',function(newValue,oldValue){
                if(newValue!=oldValue){
                    if(auxData == null){
                        $scope.tabledata=orderBy($scope.tabledata,"nombre",false)
                        auxData=$scope.tabledata;


//                        creacion  dinamica de pagination

                        var lengthData=$scope.tabledata.length/10;
                        $scope.tabledata=auxData.slice(0,10);
                        console.log(lengthData);

                        for(var i=1;i<=lengthData;i++){
                            var NavLi=angular.element('<li ng-click="listPage('+i+')">\
                                                            <a>'+i+'</a>\
                                                        </li>');
                            $(navigation).append(NavLi);
                        }
                        $compile(navigation)($scope);
                        $element.append(navigation);
                    }
                }
            });

            $scope.listPage=function(num){
                console.log(num);
                listaPage(num);
            }
            $scope.$watch('search',function(newValue,oldValue){
                console.log(newValue);
                if(newValue!=oldValue){
                    $scope.tabledata=$filter('filter')(auxData,newValue);
                    $scope.tabledata=$scope.tabledata.slice(0,10);
                }
//                $scope.tabledata=$filter('filter')($scope.tabledata,newValue);
            })
            $scope.nextList=function(){
                return function(){
                    $scope.tabledata=auxData.slice(9,19);
                    $scope.$apply();
                }()
            }
            function listaPage(num){
                $scope.tabledata=auxData.slice((num-1)*10,num*10);
                console.log($scope.tabledata);
//                $scope.$apply();
            }
        },
        link:function(scope,element,attr){
            var table=angular.element(element)[0];
            var page=attr.page;
            if(table.tagName==="TABLE"){
                var thead=$(table).children()[0];
                if(thead.tagName==="THEAD"){
                    var ChildrensThead=$(thead).children()[0];
                    angular.forEach($(ChildrensThead).children(),function(val,ind){
                        console.log(val.tagName);
                        if(val.tagName==="TH"){
                            $(val).on('click',function(){
//                                sorting Table mandando el index....}
                                if($(this).attr('sorting')){
                                    return function(self){
                                        scope.nextList();
                                    }($(this));
                                }
                            });
                        }
                    });
                }

                var Search=angular.element('<input type="text" ng-model="search">');
//              // .... poner el estilo de el search a un costado
                $(table).prepend(Search);
                $compile(Search)(scope);
            }
        }
    }
});
angular.module('epsasAngJsApp').directive('tableSortingDirective',function(){
    return{
         restrict:'A',
         require:'',
         scope:{},
         controller:function(){

         },
         link:function(){
             console.log("data-table-sorting-directive")
         }
    }
});