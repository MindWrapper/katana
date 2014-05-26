define(["screensize","text!templates/popups.mustache","mustache","extend-moment","timeElements"],function(e,t,n,r,i){var s,o={SUCCESS:"success",WARNINGS:"warnings",FAILURE:"failure",SKIPPED:"skipped",EXCEPTION:"exception",RETRY:"retry",CANCELED:"exception",NOT_REBUILT:"not_rebuilt",RUNNING:"running",NOT_STARTED:"not_started",None:""};return String.prototype.format=function(){var e=arguments;return this.replace(/{(\d+)}/g,function(t,n){return typeof e[n]!="undefined"?e[n]:t})},Number.prototype.clamp=function(e,t){return Math.min(Math.max(this,e),t)},s={init:function(){s.setCurrentItem(),s.authorizeUser(),$("#buildslave_page").length&&s.displaySum($("#currentJobs"),$("#runningBuilds_onBuildslave").find("li")),$("#builddetail_page").length>0&&s.summaryArtifactTests(),$("#tb-root").length!=0,s.menuItemWidth(e.isMediumScreen()),$(window).resize(function(){s.menuItemWidth(e.isMediumScreen())}),s.selectBuildsAction(),$(function(){var t=/chrome/.test(navigator.userAgent.toLowerCase()),n=/firefox/.test(navigator.userAgent.toLowerCase()),r=navigator.platform.toUpperCase().indexOf("WIN")!==-1;t&&$("body").addClass("chrome"),r&&$("body").addClass("win"),n&&$("body").addClass("firefox")}),s.toolTip(".ellipsis-js"),s.parseReasonString(),s.runIndividualBuild(),$("#authUserBtn").click(function(){s.eraseCookie("fullName1","","eraseCookie")}),s.tooltip($(".tooltip"))},randomImage:function(e){var t=["48273828.jpg"];e.attr("src","images/"+t[Math.floor(Math.random()*t.length)])},tooltip:function(t){t.hover(function(t){var n=$(this),r=$('<div class="tooltip-cont" />');this.t=this.title,this.title="";var i=t.pageY+20,s=t.pageX+5;$(t.target).click(function(){r.remove()}),e.isMediumScreen()&&n.hasClass("responsive-tooltip")?r.html(this.t).appendTo("body").css({top:i,right:28}).fadeIn("fast"):r.html(this.t).appendTo("body").css({top:i,left:s}).fadeIn("fast")},function(){this.title=this.t;var e=$(".tooltip-cont");e.fadeOut("fast",function(){$(this).remove()})})},authorizeUser:function(){var e=window.location;s.getCookie("BuildBotSession")===""&&(window.location="/login")},setCurrentItem:function(){var e=window.location.pathname.split("/");$(".top-menu a").each(function(t){var n=this.href.split("/");(this.id==e[1].trim().toLowerCase()||this.id=="home"&&e[1].trim().toLowerCase().length===0)&&$(this).parent().addClass("selected")})},jCenter:function(e){var t=$(window).height(),n=$(window).width(),r=e.outerHeight(),i=e.outerWidth();return t<r+5?e.css({top:5+$(window).scrollTop()+"px",height:t-60}):e.css({top:(t-r)/2+$(window).scrollTop()+"px",height:"auto"}),e.css("left",(n-i)/2+$(window).scrollLeft()+"px"),e},runIndividualBuild:function(){$("#tablesorterRt").delegate(".run-build-js","click",function(e){$(".remove-js").remove(),e.preventDefault();var r=$(this).prev(),i=r.attr("data-b"),o=r.attr("data-indexb"),u=r.attr("data-returnpage"),a='<h2 class="small-head">Your build will show up soon</h2>',f=$(n.render(t,{MoreInfoBoxOuter:!0,popUpClass:"green"},{partial:a}));f.appendTo($("body"));var l=$(this).prev().attr("data-b_name");s.jCenter(f).fadeIn("fast",function(){s.closePopup($(this)),$(this).delay(1500).fadeOut("fast",function(){$(this).remove()})});var c=location.protocol+"//"+location.host+"/forms/forceBuild",h={rt_update:"extforms",datab:i,dataindexb:o,builder_name:l,returnpage:u};h=s.codebasesFromURL(h),$.get(c,h,"json").done(function(e,t,n){var r=$("<div/>").attr("id","formCont").append($(e)).appendTo("body").hide(),i=r.find("form").ajaxForm();$(i).ajaxSubmit(function(e){requirejs(["realtimePages"],function(t){f.remove();var n=u.replace("_json","");t.updateSingleRealTimeData(n,e,!0)})})})})},parseReasonString:function(){$(".codebases-list .reason-txt").each(function(){var e=$(this).text().trim();e==="A build was forced by '':"&&$(this).remove()})},selectBuildsAction:function(e,r){function u(t){var n=e.dataTable();return $("body").append(s).show(),t+="&ajax=true",$.ajax({type:"POST",url:"/buildqueue/_selected/cancelselected",data:t,success:function(e){r===!1&&(n.fnClearTable(),n.fnAddData(e)),o.prop("checked",!1),s.remove()}}),!1}if(e===undefined){e=$("#tablesorterRt");if(e.length===0)return}var i=n.render(t,{preloader:"true"}),s=$(i),o=$("#selectall");o.click(function(){var t=e.dataTable().fnGetNodes();$(".fi-js",t).prop("checked",this.checked)}),$("#submitBtn").click(function(t){t.preventDefault();var n=e.dataTable(),r=n.fnGetNodes(),i=$(".fi-js",r),s="";i.each(function(){$(this).is(":checked")&&(s+="cancelselected="+$(this).val()+"&")});var o=s.slice(0,-1);o!=""&&u(o)}),e.delegate(".force-individual-js","click",function(e){e.preventDefault();var t=$(this).prev().prev().val(),n="cancelselected="+t;u(n)})},updateBuilders:function(){$.ajax({url:"/json/builders/?filter=0",dataType:"json",type:"GET",cache:!1,success:function(e){function i(e){var t=0;return $.each(e,function(){t+=parseFloat(this)||0}),t}var t=[],n=[],r=[];$.each(e,function(e,i){t.push(e),n.push(i.pendingBuilds),i.state=="building"&&r.push(i.currentBuilds)}),$("#pendingBuilds").text(i(n))}}),$.ajax({url:"/json/slaves/?filter=0",dataType:"json",type:"GET",cache:!1,success:function(e){var t=[];$.each(e,function(e){t.push(e)}),$("#slavesNr").text(t.length)}})},codeBaseBranchOverview:function(e){var t=decodeURIComponent(window.location.search),n=t.split("&"),r=$('<div class="border-table-holder"><div id="overScrollJS" class="inner-table-holder"><table class="codebase-branch-table"><tr class="codebase"><th>Codebase</th></tr><tr class="branch"><th>Branch</th></tr></table></div></div>');r.appendTo(e),$(n).each(function(e){var t=this.split("=");if(t[0].indexOf("_branch")>0){var n=this.split("_branch")[0];e==0&&(n=this.replace("?","").split("_branch")[0]);var r=this.split("=")[1];$("tr.codebase").append("<td>"+n+"</td>"),$("tr.branch").append("<td>"+r+"</td>")}})},menuItemWidth:function(e){if(e){var t=0;$(".breadcrumbs-nav li").each(function(){t+=$(this).outerWidth()}),$(".breadcrumbs-nav").width(t+100)}else $(".breadcrumbs-nav").width("")},toolTip:function(e){$(e).parent().hover(function(){var t=$(e,this).attr("data-txt"),n=$("<div/>").addClass("tool-tip").text(t);$(this).append($(n).css({top:$(e,this).position().top-10,left:$(e,this).position().left-20}).show())},function(){$(".tool-tip").remove()}),$(document).bind("click touchstart",function(e){$(".tool-tip").remove(),$(this).unbind(e)})},displaySum:function(e,t){e.text(t.length)},summaryArtifactTests:function(){var e=$("#showArtifactsJS");e.next().find(".builders-list").empty();var t=$("#noArtifactsJS"),n=$("li.artifact-js");n.length>0?(t.hide(),e.show().text("("+n.length+") Artifacts ").next().find(".builders-list").html(n.clone())):t.show();var r=$("#testsListJS").empty(),i=$(".s-logs-js"),s=[];$(i).each(function(){var e=$(this).text().split(".").pop();(e==="xml"||e==="html")&&s.push($(this).clone())}),s.length>0&&(r.html($("<li>Test Results</li>")),r.append(s))},setCookie:function(e,t,n){var r=new Date,i=new Date(r.getTime()+2592e6),s=n===undefined?i.toGMTString():"Thu, 01 Jan 1970 00:00:00 GMT;";document.cookie=e+"="+t+"; path=/; expires="+s},inDOM:function(e){return $.contains(document.documentElement,e[0])},delegateToProgressBar:function(e){$.each(e,function(e,t){var n=$(t);i.addProgressBarElem(n,n.attr("data-starttime"),n.attr("data-etatime"))})},verticalProgressBar:function(e,t){e.height("{0}%".format(t))},getTime:function(e,t){t===null&&(t=Math.round(+(new Date)/1e3));var n=t-e,r=Math.round(n),i=Math.floor(n/86400)==0?"":Math.floor(n/86400)+" days ",s=Math.floor(n/3600)==0?"":Math.floor(n/3600)%24+" hours ",o=Math.floor(r/60)==0?"":Math.floor(r/60)%60+" mins, ",u=r-Math.floor(r/60)*60+" secs ";return i+s+o+u},getResult:function(e){var t=["success","warnings","failure","skipped","exception","retry","canceled"];return t[e]},getSlavesResult:function(e,t){return e===!1?"Not connected":t.length>0?"Running":"idle"},getClassName:function(e,t){var n=s.getSlavesResult(e,t);return n==="Not connected"?"status-td offline":n==="Running"?"status-td building":"status-td idle"},getCurrentPage:function(){return document.getElementsByTagName("body")[0].id},hasfinished:function(){var e=!1,t=$("#isFinished").attr("data-isfinished");return t===undefined&&(e=!1),t===!0&&(e=!0),e},isRealTimePage:function(){var e=!1,t=["buildslaves_page","builderdetail_page","builddetail_page","buildqueue_page","projects_page","home_page","builders_page","jsonhelp_page","usersettings_page"],n=s.getCurrentPage();return $.each(t,function(t,r){r===n&&(e=!0)}),e},getCookie:function(e){var t=new RegExp(e+"=([^;]+)"),n=t.exec(document.cookie);return n!=null?decodeURI(n[1]):""},eraseCookie:function(e,t,n){s.setCookie(e,t,n)},closePopup:function(e,t){var n=$(".close-btn").add(document);n.bind("click touchstart",function(r){if(!$(r.target).closest(e).length||$(r.target).closest(".close-btn").length)t===undefined?e.remove():e.slideUp("fast",function(){n.unbind(r)}),n.unbind(r)})},codebasesFromURL:function(e){var t=window.location.search.substring(1),n=t.split("&");return $.each(n,function(t,n){var r=n.split("=");r[0].indexOf("_branch")>=0&&(e[r[0]]=r[1])}),e},urlParamsToString:function(e){var t=[];return $.each(e,function(e,n){t.push(e+"="+n)}),t.join("&")},getCssClassFromStatus:function(e){var t=Object.keys(o).map(function(e){return o[e]});return t[e]},setIFrameSize:function(e){if(e){var t=e.contentWindow||e.contentDocument.parentWindow;t.document.body&&(e.height=t.document.documentElement.scrollHeight||t.document.body.scrollHeight,e.width=t.document.documentElement.scrollWidth||t.document.body.scrollWidth)}},objectPropertiesToArray:function(e){var t=[],n;for(n in e)e.hasOwnProperty(n)&&t.push(e[n]);return t}},s});