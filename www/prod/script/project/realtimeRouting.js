define(["jquery","helpers","realtimePages"],function(e,i){var r;return r={init:function(){switch(i.getCurrentPage()){case"builddetail_page":require(["rtBuildDetail"],function(e){e.init()});break;case"builders_page":require(["rtBuilders"],function(e){e.init()});break;case"builderdetail_page":require(["rtBuilderDetail"],function(e){e.init()});break;case"buildslaves_page":require(["rtBuildSlaves"],function(e){e.init()});break;case"buildslavedetail_page":require(["rtBuildSlaveDetail"],function(e){e.init()});break;case"buildqueue_page":require(["rtBuildQueue"],function(e){e.init()});break;default:require(["rtGlobal"],function(e){e.init()})}}}});
//# sourceMappingURL=realtimeRouting.js.map