/**
 * Created by 41212 on 2017/3/12.
 */

require("../../css/HomePage/base");
require("../../css/HomePage/common");
require("../../css/HomePage/index");
var content = require("../../html/HomePage/HomePageNav.html");
var comNav = require("../../html/HomePage/HomePageContent.html");
avalon.define({
    $id : "HomePage",
    HomePageNav: comNav,
    HomePageSideBar :"",
    HomePageContent :content
});
