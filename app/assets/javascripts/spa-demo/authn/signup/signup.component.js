(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .component("sdSignup", {
      templateUrl: templateUrl,
      controller: SignupController,
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_signup_html;
  }    

  SignupController.$inject = ["$scope","$state","spa-demo.authn.Authn",
                              "spa-demo.layout.DataUtils","spa-demo.subjects.Image"];
  function SignupController($scope, $state, Authn, DataUtils, Image) {
    var vm=this;
    vm.signupForm = {}
    vm.signup = signup;
    vm.setImageContent = setImageContent;

    vm.$onInit = function() {
      console.log("SignupController",$scope);
      newImageResource();
    }
    return;
    //////////////

    function newImageResource() {
      console.log("newImageResource()");
      vm.image = new Image();
      // vm.imagesAuthz.newItem(vm.item);
      return vm.image;
    }


    function signup() {
      console.log("signup...");
      $scope.signup_form.$setPristine();

      Authn.signup(vm.signupForm).then(
        function(response){
          vm.id = response.data.data.id;
          console.log("signup complete");

          // go through the process of creating image is one is selected
          if (vm.image.image_content!= null) {
            vm.image.photo_user_id = vm.id;
            vm.image.$save().then(
              function(){
                vm.signupForm.image_id = vm.image.id;
                console.log("image created");
                console.log(vm.signupForm);
                Authn.updateSignup(vm.signupForm).then(
                  function(response){
                    console.log("signup updated", response.data, vm);          
                    $state.go("home");
                  },
                  function(response){
                    vm.signupForm["errors"]=response.data.errors;
                    console.log("signup failure", response, vm);          
                  }
                );
              },
              handleError
            );
          } else { // end of the if
            console.log("signup updated", response.data, vm);          
            $state.go("home");
          }
        },
        function(response){
          vm.signupForm["errors"]=response.data.errors;
          console.log("signup failure", response, vm);          
        }
      );
    }

    function setImageContent(dataUri) {
      console.log("setImageContent", dataUri ? dataUri.length : null);      
      vm.image.image_content = DataUtils.getContentFromDataUri(dataUri);
    }  
    
    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.image["errors"]=response.data.errors;          
      } 
      if (!vm.image.errors) {
        vm.image["errors"]={}
        vm.image["errors"]["full_messages"]=[response]; 
      }      
      $scope.signup_form.$setPristine();
    }

    // function create() {
    //   vm.image.$save().then(
    //     function(){
    //        $state.go(".", {id: vm.item.id}); 
    //     },
    //     handleError);
    // }

  }
})();