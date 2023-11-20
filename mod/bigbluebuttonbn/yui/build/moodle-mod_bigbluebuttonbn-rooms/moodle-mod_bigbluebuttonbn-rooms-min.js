YUI.add("moodle-mod_bigbluebuttonbn-rooms",function(b,t){M.mod_bigbluebuttonbn=M.mod_bigbluebuttonbn||{},M.mod_bigbluebuttonbn.rooms={datasource:null,bigbluebuttonbn:{},panel:null,pinginterval:null,init:function(t){this.datasource=new b.DataSource.Get({source:M.cfg.wwwroot+"/mod/bigbluebuttonbn/bbb_ajax.php?sesskey="+M.cfg.sesskey+"&"}),this.bigbluebuttonbn=t,this.pinginterval=t.ping_interval,0===this.pinginterval&&(this.pinginterval=1e4),-1==this.bigbluebuttonbn.profile_features.indexOf("all")&&-1==this.bigbluebuttonbn.profile_features.indexOf("showroom")||this.initRoom(),this.initCompletionValidate()},initRoom:function(){if("open"!==this.bigbluebuttonbn.activity){var t=[M.util.get_string("view_message_conference_has_ended","bigbluebuttonbn")];return"ended"!==this.bigbluebuttonbn.activity&&(t=[M.util.get_string("view_message_conference_not_started","bigbluebuttonbn"),this.bigbluebuttonbn.opening,this.bigbluebuttonbn.closing]),void b.DOM.addHTML(b.one("#status_bar"),this.initStatusBar(t))}this.updateRoom()},updateRoom:function(t){var n,e,o="false";void 0!==t&&t&&(o="true"),n=this.bigbluebuttonbn.meetingid,e=this.bigbluebuttonbn.bigbluebuttonbnid,this.datasource.sendRequest({request:"action=meeting_info&id="+n+"&bigbluebuttonbn="+e+"&updatecache="+o,callback:{success:function(t){b.DOM.addHTML(b.one("#status_bar"),M.mod_bigbluebuttonbn.rooms.initStatusBar(t.data.status.message)),b.DOM.addHTML(b.one("#control_panel"),M.mod_bigbluebuttonbn.rooms.initControlPanel(t.data)),"undefined"!=typeof t.data.status.can_join&&b.DOM.addHTML(b.one("#join_button"),M.mod_bigbluebuttonbn.rooms.initJoinButton(t.data.status)),"undefined"!=typeof t.data.status.can_end&&t.data.status.can_end&&b.DOM.addHTML(b.one("#end_button"),M.mod_bigbluebuttonbn.rooms.initEndButton(t.data.status)),t.data.status.can_join||M.mod_bigbluebuttonbn.rooms.waitModerator({id:n,bnid:e})}}})},initStatusBar:function(t){var n,e,o=b.DOM.create('<span id="status_bar_span">');if(t.constructor!==Array)return b.DOM.setText(o,t),o;for(n in t)t.hasOwnProperty(n)&&(e=b.DOM.create('<span id="status_bar_span_span">'),b.DOM.setText(e,t[n]),b.DOM.addHTML(o,e),b.DOM.addHTML(o,b.DOM.create("<br>")));return o},initControlPanel:function(t){var n,e=b.DOM.create("<div>");return b.DOM.setAttribute(e,"id","control_panel_div"),n="",t.running&&(n+=this.msgStartedAt(t.info.startTime)+" ",n+=this.msgAttendeesIn(t.info.moderatorCount,t.info.participantCount)),b.DOM.addHTML(e,n),e},msgStartedAt:function(t){var n=parseInt(t,10)-parseInt(t,10)%1e3,e=new Date(n),o=e.getHours(),i=e.getMinutes(),b=M.util.get_string("view_message_session_started_at","bigbluebuttonbn");return b+" <b>"+o+":"+(i<10?"0":"")+i+"</b>."},msgModeratorsIn:function(t){var n=M.util.get_string("view_message_moderators","bigbluebuttonbn");return 1==t&&(n=M.util.get_string("view_message_moderator","bigbluebuttonbn")),n},msgViewersIn:function(t){var n=M.util.get_string("view_message_viewers","bigbluebuttonbn");return 1==t&&(n=M.util.get_string("view_message_viewer","bigbluebuttonbn")),n},msgAttendeesIn:function(t,n){var e,o,i,b;return this.hasParticipants(n)?(e=this.msgModeratorsIn(t),o=n-t,i=this.msgViewersIn(o),b=M.util.get_string("view_message_session_has_users","bigbluebuttonbn"),1<n?b+" <b>"+t+"</b> "+e+" "+M.util.get_string("view_message_and","bigbluebuttonbn")+" <b>"+o+"</b> "+i+".":(b=M.util.get_string("view_message_session_has_user","bigbluebuttonbn"),0<t?b+" <b>1</b> "+e+".":b+" <b>1</b> "+i+".")):M.util.get_string("view_message_session_no_users","bigbluebuttonbn")+"."},hasParticipants:function(t){return void 0!==t&&0<t},initJoinButton:function(t){var n,e,o,i=b.DOM.create("<input>");return b.DOM.setAttribute(i,"id","join_button_input"),b.DOM.setAttribute(i,"type","button"),b.DOM.setAttribute(i,"value",t.join_button_text),b.DOM.setAttribute(i,"class","btn btn-primary"),n="M.mod_bigbluebuttonbn.rooms.join('"+t.join_url+"');",b.DOM.setAttribute(i,"onclick",n),t.can_join||(b.DOM.setAttribute(i,"disabled",!0),e=b.one("#status_bar_span"),o=b.DOM.create("<img>"),b.DOM.setAttribute(o,"id","spinning_wheel"),b.DOM.setAttribute(o,"src","pix/i/processing16.gif"),b.DOM.addHTML(e,"&nbsp;"),b.DOM.addHTML(e,o)),i},initEndButton:function(t){var n=b.DOM.create("<input>");return b.DOM.setAttribute(n,"id","end_button_input"),b.DOM.setAttribute(n,"type","button"),b.DOM.setAttribute(n,"value",t.end_button_text),b.DOM.setAttribute(n,"class","btn btn-secondary"),t.can_end&&b.DOM.setAttribute(n,"onclick","M.mod_bigbluebuttonbn.broker.endMeeting();"),n},endMeeting:function(){b.one("#control_panel_div").remove(),b.one("#join_button").hide(),b.one("#end_button").hide()},remoteUpdate:function(t){setTimeout(function(){M.mod_bigbluebuttonbn.rooms.cleanRoom(),M.mod_bigbluebuttonbn.rooms.updateRoom(!0)},t)},cleanRoom:function(){b.one("#status_bar_span").remove(),b.one("#control_panel_div").remove(),b.one("#join_button").setContent(""),b.one("#end_button").setContent("")},windowClose:function(){window.onunload=function(){opener.M.mod_bigbluebuttonbn.rooms.remoteUpdate(5e3)},window.close()},waitModerator:function(n){var e=setInterval(function(){M.mod_bigbluebuttonbn.rooms.datasource.sendRequest({request:"action=meeting_info&id="+n.id+"&bigbluebuttonbn="+n.bnid,callback:{success:function(t){if(t.data.running)return M.mod_bigbluebuttonbn.rooms.cleanRoom(),M.mod_bigbluebuttonbn.rooms.updateRoom(),void clearInterval(e)},failure:function(t){n.message=t.error.message}}})},this.pinginterval)},join:function(t){M.mod_bigbluebuttonbn.broker.joinRedirect(t),setTimeout(function(){M.mod_bigbluebuttonbn.rooms.cleanRoom(),M.mod_bigbluebuttonbn.rooms.updateRoom(!0)},15e3)},initCompletionValidate:function(){var t,n=b.one("a[href*=completion_validate]");n&&(t=n.get("hash").substr(1),n.on("click",function(){M.mod_bigbluebuttonbn.broker.completionValidate(t)}))}}},"@VERSION@",{requires:["base","node","datasource-get","datasource-jsonschema","datasource-polling","moodle-core-notification"]});