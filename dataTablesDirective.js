/**
 * Created by zeladaa on 18-08-15.
 */
//<table table-directive tabledata="data" filter="nombre">
//

angular.module('app').factory('tableFactory',function(){

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

            $scope.auxData=null;
            $scope.searchData=null;
            $scope.formSorting=true;
            $scope.showItem=[];            
            $scope.pageNow=1;

            var navigation=angular.element('<ul class="pagination"></ul>');
            navigation=navigation[0];

            $scope.sorting=function(attr){
                $scope.tabledata=orderBy($scope.tabledata,attr,$scope.formSorting);
                $scope.$apply();
            }

            $scope.$watch('tabledata',function(newValue,oldValue){            
                if(newValue!=oldValue){
                    console.log("cambio Data");
                    if($scope.auxData == null){
                        $scope.tabledata=orderBy($scope.tabledata,"nombre",false)
                        $scope.auxData=$scope.tabledata;
                        createPagination('tabledata');                            
                        $scope.tabledata=$scope.auxData.slice(0,10);                                                                    
                    }     
                    if($scope.search){                    
                        createPagination('searchData');
                    }      
                }                
            });

            $scope.$watch('search',function(newValue,oldValue){                
                if(newValue!=oldValue){
                    $scope.searchData=$filter('filter')($scope.auxData,newValue);                                        
                    $scope.tabledata=$scope.searchData.slice(0,10);
                    if(newValue==""){
                        createPagination('searchData');
                    }
                }                
            });

            $scope.listPage=function(num,show){     
                $scope.pageNow=num;                                           
                var nextItem=$scope.showItem[num+1];
                var lastItem=$scope.showItem[num-1];                

                if(!angular.isUndefined(nextItem) && !angular.isUndefined(lastItem)){
                    if(nextItem.active==false){
                        nextItem.active=true;
                        if(!angular.isUndefined($scope.showItem[num-4])){
                            $scope.showItem[num-4].active=false;
                        }
                    }
                    if(lastItem.active==false){
                        lastItem.active=true;
                        if(!angular.isUndefined($scope.showItem[num+4])){
                            $scope.showItem[num+4].active=false;
                        }
                    }
                }            
                listaPage(num);
            }

            $scope.nextPage=function(){
                return function(){
                    $scope.pageNow++;
                    listaPage($scope.pageNow);
                }()
            }

            $scope.lastPage=function(){
                return function(){
                    $scope.pageNow--;
                    listaPage($scope.pageNow);
                }()
            }

            $scope.nextList=function(){
                return function(){
                    $scope.tabledata=$scope.auxData.slice(9,19);
                    $scope.$apply();
                }()
            }

            function createPagination(data){
                var lengthData=Math.ceil($scope[data].length/10);  
                $(navigation).empty();                                        
                $scope.showItem=[];
                for(var i=1;i<=lengthData+1;i++){
                    if(i<=6){
                        console.log(i);
                        $scope.showItem.push({
                            num:i,
                            active:true
                        });
                    }else{
                        $scope.showItem.push({
                            num:i,
                            active:false
                        });
                    }
                }
                for(var i=1;i<=lengthData;i++){
                    var NavLi=angular.element('<li ng-show="showItem['+i+'].active" ng-class="{\'active\':showItem['+i+'].num==pageNow}" ng-click="listPage('+i+')">\
                                                    <a>'+i+'</a>\
                                                </li>');
                    $(navigation).append(NavLi);
                }
                var onBack=angular.element('<li class="disabled" ng-click="lastPage()">\
                                                                    <a > Atras  </a>\
                                                                </li>')
                var next=angular.element('<li ng-disable="false" ng-click="nextPage()">\
                                                    <a> Siguiente </a>\
                                                </li>')
                $(navigation).prepend(onBack);                
                $(navigation).append(next);


                $compile(navigation)($scope);
                $element.append(navigation);                        
            }

            function listaPage(num){
                if($scope.search){
                    $scope.tabledata=$scope.searchData.slice((num-1)*10,num*10);                    
                }else{                    
                    $scope.tabledata=$scope.auxData.slice((num-1)*10,num*10);
                }                                
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