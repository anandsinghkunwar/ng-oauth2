(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('ngOAuth2.config', [])
      .value('ngOAuth2.config', {
          debug: true
      });

  // Modules
  angular.module('ngOAuth2.directives', []);
  angular.module('ngOAuth2.filters', []);
  angular.module('ngOAuth2.services', []);
  angular.module('ngOAuth2',
      [
          'ngOAuth2.config',
          'ngOAuth2.directives',
          'ngOAuth2.filters',
          'ngOAuth2.services',
          'ngResource',
          'ngCookies',
          'ngSanitize'
      ]);

})(angular);
