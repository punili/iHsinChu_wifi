var map; 
var markers = [];		
var area;
$(document).ready(function(){
	$('.list').hide();						
	$('#search').bind('click',function(){
		$.ajax({ 
		    type:'GET', 
		 	url:'http://opendata.hccg.gov.tw/dataset/beeb0065-2f96-4119-a15c-a7641c623be7/resource/acc17e6f-11a2-49bd-b923-37107aacdbd3/download/20171201135132790.json', 
		    success:function (data){
		    	var thisdata = data;
		    	$('.list').show();
			    clearMarkers();					    				    
			    listAll(data);					    
		    },
		    fail: function() {
		      alert('無法取得熱點資料!');
		    }
		});
  	});
  	setTimeout(function(){   //初始先列出新竹市全區熱點
		$('#search').click();
		},50);		  		
});
		

function listAll(data) {
	clearMarkers();			
	area = $('select option:selected').val();
	searchCenter(area);  //設定地圖中央
		
	// 跑 for 迴圈撈資料      
     for (i=0;data.length>i;i++) {
        if(area == data[i].鄉鎮市區){
        	var myLatlng = new google.maps.LatLng(data[i].緯度, data[i].經度);		        
	        var title=  data[i].熱點名稱;		    
	  		var address = data[i].地址;
	        var str;
        	str = '<div class="item">機構名稱：'+data[i].機關構名稱 +'<br />熱點名稱：'+title +'<br />地址：'+address+'</div>';
	        $('#list').append(str);		        
	        addMarker(myLatlng,title,address, map);
        } else if(area == 'all'){
        	var myLatlng = new google.maps.LatLng(data[i].緯度, data[i].經度);		        
	        var title=  data[i].熱點名稱;		    
	  		var address = data[i].地址;
	        var str;
        	str = '<div class="item">機構名稱：'+data[i].機關構名稱 +'<br />熱點名稱：'+title +'<br />地址：'+address+'</div>';
	        $('#list').append(str);		        
	        addMarker(myLatlng,title,address, map);
        }		          		        
	 }	
}
// 將地圖中央自動定位到所搜尋的區域
function searchCenter(area) {
	var infowindow = new google.maps.InfoWindow();			
	var searchMarker = new google.maps.Marker();
	var geocoder = new google.maps.Geocoder();
	if (area !== 'all') {
        // 將區域名稱轉換為座標
        geocoder.geocode({
          'address': '新竹市' + area
        	}, function(results, status) {		        	
		        if (status === google.maps.GeocoderStatus.OK) {
		            map.setCenter(results[0].geometry.location);				            
		            map.setZoom(13);
		        }
	          	
        });
    }else if(area =='all'){
    	geocoder.geocode({
          'address': '新竹市' 
        	}, function(results, status) {		        	
		        if (status === google.maps.GeocoderStatus.OK) {
		            map.setCenter(results[0].geometry.location);				            
		            map.setZoom(12);
		        }
	          	
        });
    }else {		      
      
    }
}

// 在地圖上增加 marker 圖示
function addMarker(location,title,address, map) {		  	
  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
  	icon: {
      url: 'pic/wifi.png',
      size: new google.maps.Size(50, 65),
      scaledSize: new google.maps.Size(30, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(8, 8)
    },
    position: location,		    
    map: map,
    animation: google.maps.Animation.DROP,
    title: title
  });
  	  
  google.maps.event.addListener(marker, 'click', function() {
	infowindow.setContent('<div class="infoContent">' + title + '<br/>地址：'+ address + '</div>');
	infowindow.open(map,marker);
  });
  markers.push(marker);
}
// 清除地圖上原有 marker 圖示
function clearMarkers() {
	$('#list').html('');
    if(typeof(markers)!=='undefined'){
        //Loop through all the markers and remove   
		for (var i = 0; i < markers.length; i++) {   
		    markers[i].setMap(null);
		}   
  	}
    markers = [];
}
//初始化map
function initMap() {  
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 24.786334, lng:120.999979},
	  zoom: 13,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
    });	        
   
    google.maps.event.addDomListener(window, 'resize', function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
	getUserLocation();
}
	//尋找使用者位置
function getUserLocation(){
		var geolocMarker = new google.maps.Marker({
	    icon: {
	    	path: google.maps.SymbolPath.CIRCLE,
	        fillColor: 'red',
	        fillOpacity: 1,
	        strokeColor: 'orange',
	        strokeWeight: 5,
			strokeOpacity: 0.5,
	        scale: 6,		        
	    }
	});
	var Opac = 0.5;  //設定 使用者位置 geolocMarker 閃爍效果
	setInterval(function(){
		geolocMarker.setIcon({
			path: google.maps.SymbolPath.CIRCLE,
	        fillColor: 'red',
	        fillOpacity: 1,
	        strokeColor: 'red',
	        strokeWeight: 10,				
	        scale: 6,
			strokeOpacity: Opac
			
		});
		Opac = Opac - 0.3;
		if (Opac<0) {
			Opac = 0.5;
		}
	}, 300);
  	// HTML5 geolocation.
    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };	            
            geolocMarker.setPosition(pos);
            geolocMarker.setMap(map);
            map.setCenter(pos);
            map.setZoom(14);
          }, function() {
            handleLocationError(true, geolocMarker, map.getCenter());
          });
    } else {
          // 若瀏覽器不支援地理位置偵測服務
          handleLocationError(false, geolocMarker, map.getCenter());
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      geolocMarker.setPosition(pos);
      geolocMarker.setContent(browserHasGeolocation ?
                          'Error: 地理位置偵測失敗.' :
                          'Error: 您的瀏覽器不支援地理位置偵測服務');
    }    	
}