/**
 * Created by Administrator on 2016/6/3.
 * know auth 模块
 * 依赖 ngResource 模块
 */
angular.module('know.auth', ['ngResource']);
;
/**
 * Created by Administrator on 2016/6/3.
 * know home 模块
 * 依赖 ngResource 模块
 */
angular.module('know.home', ['ngResource']);
;
/**
 * Created by Administrator on 2016/6/3.
 * know核心模块
 * 依赖 ngResource 模块
 */
angular.module('know.index', ['ngResource']);
;
angular.module('know.knowdoc', ['ngResource']);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `know` module
angular.module('know', [
    'know.index',
    'know.home',
    'know.auth',
    'know.detail',
    'know.center',
    'know.knowdoc',
    'know.template',
    'know.search'

]);;
angular.module('know.detail', ['ngResource']);
;
angular.module('know.search', ['ngResource']);
;
angular.module('know.center', ['ngResource']);
;
angular.module('know.template', ['ngResource']);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';
// Define the `phoneDetail` module
angular.module('backModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `homeModule` module
angular.module('backHomeModule', [ 
    'know' 
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `knowGatewayModule` module
angular.module('knowGatewayModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('adminModule', [
    'know'
]);


;

'use strict';

// Define the `phoneDetail` module
angular.module('applAnalysisModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('businessModelingModule', [
    'know'
]);


;

'use strict';

// Define the `phoneDetail` module
angular.module('functionalTestModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('homePage', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('indexModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('knowledgeManagementModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `communityModule` module
angular.module('knowDetailsModule', [
    'know' 
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('loginModule', [
    'know'
]);









;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('materialManagement', [
    'know'
]);

;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('myApplicationSettingModule', [
    'know'
]);


;
/**
 * Created by Administrator on 2016/6/3.
 */
'use strict';

// Define the `phoneDetail` module
angular.module('myApplicationModule', [
    'know'
]);


