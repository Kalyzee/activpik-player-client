/**
*
* Kalyzee video player API
* @param Element the embed element
* @Licence : GPL
* @author : Ludovic Bouguerra
* http://www.kalyzee.com
*/
var KalyzeePlayerAPI = function(element){

	_this = this;
	this.parent = element;
	this.windowElement = document.getElementById(element).contentWindow;
	this.currentTime = 0;
	this.ready = false;

	var _listeners = Array();


	var _addListeners = function(eventName, listener, subscription_event){
		if (_listeners[eventName] === undefined){
			if (subscription_event !== undefined){
				_this.windowElement.postMessage( {"type" : subscription_event} ,"*");
			}
			_listeners[eventName] = new Array();
		}
		_listeners[eventName].push(listener);
	}

	var _fireListeners = function(eventName, callback){
		if (_listeners[eventName] !== undefined){
		    for (listener in _listeners[eventName]){

        		if (typeof(_listeners[eventName][listener]) === "function" ){

            		callback(_listeners[eventName][listener]);
        		}
    		}

		}
	}

	subscribeMessageEvent = function(callback){
		if (window.addEventListener){
			window.addEventListener("message", callback, false);
		}else{
			window.attachEvent("message", callback, false);
		}
	}

	init = function(){
		subscribeMessageEvent(function(message){
			if (message.source === _this.windowElement){
				if ((typeof message.data  === "object")){
					if (message.data.type == "event_time_update"){
						fireTimeUpdate(message.data.time);
					}else{
						if (message.data.type == "event_player_ready"){
							_this.ready = true;
							fireOnReady();
							_this.windowElement.postMessage( {"type" : "subscribe_on_time_update"} ,"*");
						}else{

							if (message.data.type == "event_seek"){
								fireOnSeek();
							}else{
								if (message.data.type == "event_pause"){
									fireOnPause();
								}else{
									if (message.data.type == "event_play"){
										fireOnPlay();
									}else{
										if (message.data.type == "event_end"){
											fireOnEnd();
										}
									}
								}
							}
						}
					}
				}
			}
		});

	}

	addElement = function(event, start, end, left, top, width, height, options){
		_this.windowElement.postMessage({"type":"interactivity", "event": event ,"start":start, "end": end, "left": left, "top": top, "width": width, "height": height, "options": options},"*");

	}

	fireTimeUpdate = function(time){
		_fireListeners("onTime", function(callback){
			callback({"time": time});
		});
	}

	fireOnSeek = function(from, to){
		_fireListeners("onSeek", function(callback){
			callback({"from": from, "to": to});
		});
	}

	fireOnPause = function(){
		_fireListeners("onPause", function(callback){
			callback();
		});
	}

	fireOnPlay = function(){
		_fireListeners("onPlay", function(callback){
			callback();
		});
	}

	fireOnReady = function(){
		_fireListeners("onReady", function(callback){
			callback();
		});
	}

	fireOnEnd = function(){
		_fireListeners("onEnd", function(callback){
			callback();
		});
	}

	this.play = function(){
		this.windowElement.postMessage({"type" : "play"},"*");
	}

	this.pause = function(){
		this.windowElement.postMessage( {"type" : "pause"},"*");
	}

	this.stop = function(){
		this.windowElement.postMessage({"type" : "stop"},"*");
	}

	this.seek = function(time){
		this.windowElement.postMessage({"type":"seek", "time": time},"*");
	}

	this.setVolume = function(volume){
		this.windowElement.postMessage({"type":"volume", "volume":volume},"*");
	}

	this.getTime = function(){
		return _this.currentTime;
	}

	this.onTimeUpdate = function(callback){
		_addListeners("onTime", callback, "subscribe_on_time_update");
	}

	this.onSeek = function(callback){
		_addListeners("onSeek", callback, "subscribe_on_seek");

	}

	this.onPlay = function(callback){
		_addListeners("onPlay", callback, "subscribe_on_play");
	}

	this.onPause = function(callback){
		_addListeners("onPause", callback, "subscribe_on_pause");
	}

	this.onReady = function(callback){
		_addListeners("onReady", callback);
	}

	this.onVolumeChange = function(callback){
		_addListeners("onVolumeChange", callback, "subscribe_on_volume_change");
	}

	this.onEnd = function(callback){
		_addListeners("onEnd", callback, "subscribe_on_end");

	}


	this.addImage = function(begin, end, left, top, width, height, src, link){
		addElement("image", begin, end, left, top, width, height, {"options": src, "link": link})
	}

	init();

	return this;
};
