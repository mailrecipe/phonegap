//var host = window.location.href.indexOf("file://")>=0?"http://localhost:8888":"";
//var host = "http://localhost:8888";
var host = "http://mailrecipe-beta.appspot.com";
$.support.cors = true;

function MobileBox()
{
	this.id = null;
	this.selected = 0;
	this.tab = "inquiry";
	this.inbox = {};
	this.data = {};
	this.contact = {};
	this.product = {};
	this.template = new EJS({element: "box-ejs"});

	this.register = function(id)
	{
		this.id = id;
		this.load();
	};

	this.edit = function()
	{
		var vis = $("#editable").is(':visible');
		if(vis)
		{
			$("#editable").hide();
			$("#viewable").show();
		}
		else
		{
			var txtval = $("#viewable").text().replace(/\t/g,"").replace(/\n\n/g,"\n");
			$("#editable").val($.trim(txtval));
			$("#editable").show();
			$("#viewable").hide();
		}
	}

	this.load = function()
	{
		var curr = this;
		jQuery.ajax({
			url: host+"/items", dataType : "json", type:"GET", data:{id:curr.id},
			success: function(dao)
			{
				curr.data = dao;
				curr.render();
				//$("#flipRoot").flip({ forwardDir: 'ltor', height: 'auto' });
			},
			error: function(e){
				//curr.data = {error: "Could not load inbox items. Try reloading the page."};
			}
		});
	};

	this.goNext = function()
	{
		var nxt = this.selected+1;
		if(nxt == this.data.mails.length)
		{
			this.select(0);
		}
		else
		{
			this.select(nxt);
		}
	}

	this.goBack = function()
	{
		var bck = this.selected-1;
		if(this.selected == 0)
			jQuery('#menu').panel('open',{});
		else
		{
			this.select(bck);
		    $.mobile.changePage("#flipRoot", {allowSamePageTransition:true, reverse:true, transition:"slidefade"});
		}
	}

	this.select = function(sel)
	{
		if(sel < this.data.mails.length)
			this.selected = sel;
		else
			this.selected = this.selected;
		this.tab = "inquiry";
		this.recommend = null;
		this.render();
	};

	this.resize = function()
	{
		var hps = $("#productshot").height();
		var hsb = $("#subject").height();
		$("#spacer").height(hps-hsb-80);
	}

	this.render = function()
	{
		var thtml = this.template.render(this);
		thtml = window["toStaticHTML"]?window.toStaticHTML(thtml):thtml;
		jQuery("#flipRoot").html(thtml);
		new gnMenu( document.getElementById( 'gn-menu' ) );
		var curr = this;
		jQuery("#btn-send").click(function() {
			curr.goNext();
		});
	};
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var Months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function prettyDate(dt){
	var mn = Months[dt.getMonth()];
	var hr = dt.getHours();
	return mn + " " + dt.getDate() + ", " + (hr>12?hr-12:hr) + ":" + dt.getMinutes() + (hr>12?"pm":"am");
}

function categorize(body)
{
	if(body == null)
		return null;
	else if(jQuery.trim(body)=="")
		return null;
	else
	{
		body = body.toLowerCase();
		return null;
	}
}

function hasAny(body, words)
{
	for(var i = 0; i < words.length; i++)
		if(body.indexOf(words[i])>=0)
			return true;
	return false;
}
