define(["jquery","jquery-ui"],function(e){e.widget("katana.preloader",{options:{destroyAfter:!1,autoShow:!0,timeout:3e4},_create:function(){this.element.append(e("<div/>").attr("id","bowl_ringG").append(e("<div/>").addClass("ball_holderG").append(e("<div/>").addClass("ballG")))).hide(),this.options.autoShow&&this.showPreloader()},destroy:function(){this._clearTimeout(),this.element.find("div#bowl_ringG").remove(),e.Widget.prototype.destroy.call(this)},showPreloader:function(){this._clearTimeout(),this.element.show(),this.timeout=this._delay(this.hidePreloader,this.options.timeout)},hidePreloader:function(){this._clearTimeout(),this.element.hide(),this.options.destroyAfter&&this.element.remove(),this._destroy()},_clearTimeout:function(){void 0!==this.timeout&&(clearTimeout(this.timeout),this.timeout=void 0)}})});
//# sourceMappingURL=preloader.js.map