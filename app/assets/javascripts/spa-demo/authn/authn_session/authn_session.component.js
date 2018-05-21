(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .component("sdAuthnSession", {
      templateUrl: templateUrl,
      controller: AuthnSessionController
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_session_html;
  }    

  AuthnSessionController.$inject = ["$scope","spa-demo.authn.Authn","spa-demo.authn.whoAmI"];
  function AuthnSessionController($scope, Authn,whoAmI) {
    var vm=this;
    vm.loginForm = {}
    vm.login = login;
    vm.logout = logout;
    vm.getCurrentUser = Authn.getCurrentUser;
    vm.getCurrentUserName = Authn.getCurrentUserName;    
    vm.getCurrentUserImage = getCurrentUserImage;
    vm.user_image_src = null;

    vm.$onInit = function() {
      console.log("AuthnSessionController",$scope);
      whoAmI.get().$promise.then(
          function(value){ 
            // if (vm.user_image_src!= null) {
            if (value.content_url!=null) {
              vm.user_image_src = value.content_url+"?width=40";
            }
            // }
            console.log("User Image URL:")
            console.log(vm.user_image_src)
          }
        )
    }
    vm.$postLink = function() {
      vm.dropdown = $("#login-dropdown")
    }
    return;
    //////////////
    function login() {
      console.log("login");
      $scope.login_form.$setPristine();
      vm.loginForm["errors"] = null;
      Authn.login(vm.loginForm).then(
        function(){
          vm.dropdown.removeClass("open");

          //get the thumbnail after logging in succesfully
          whoAmI.get().$promise.then(
            function(value){ 
              if (value.content_url!=null) {
                vm.user_image_src = value.content_url+"?width=40";
              }
              console.log("User Image URL:")
              console.log(vm.user_image_src)
            }
          )

        },
        function(response){
          vm.loginForm["errors"] = response.errors;
        });
    }
    function logout() {
      Authn.logout().then(
        function(){
          vm.dropdown.removeClass("open");
          vm.user_image_src = null;
        });
    }

    function getCurrentUserImage() {
        return vm.getCurrentUser!=null ? vm.user_image_src : null;
    }

  }
})();