// useful functions copied from className
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + ' ') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}
function addEvent(node,event,handler){
    if (!!node.addEventListener){
        node.addEventListener(event,handler,!1);
    }else{
        node.attachEvent('on'+event,handler);
    }
}

function getDataset(element){
    if(element.dataset){
        return element.dataset;
    }else{
        var attr=element.attributes;   //get all attribute
        var dataset={};        
        for (var i = 0; i < attr.length; i++) {     
            if(/^data-/.test(attr[i].nodeName)){        
                var name=attr[i].nodeName.slice(5).toLowerCase().replace(/-(.)/g,function(match,p1){
                    return p1.toUpperCase()});     //camel syntax
                dataset[name]=attr[i].nodeValue; 
            }        
        }
    }
    return dataset;
}

function setCookie (name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}

function getCookie (name) {
    var cookie, cookieStart;
    var all = document.cookie;
    name = encodeURIComponent(name) + "=";
    if (all === ''){
    	return null;
    }else if((cookieStart = all.indexOf(name)) == -1){
    	return null
    }else{
   		var cookieEnd = all.indexOf(";", cookieStart);
   		if (cookieEnd == -1){
   			cookieEnd = all.length;
   		}
   		cookie = decodeURIComponent(all.substring(cookieStart + name.length, cookieEnd));
   		return cookie;
    }
}

function removeCookie (name, path, domain) {
    setCookie(name, "", new Date(0), path, domain) ;
}
// 固定用户帐号:studyOnline ; 固定用户密码:study.163.com ;
function submit () {
	var form = document.getElementsByTagName("form")[0];
	var userId = form.id.value;
	var password = form.password.value;
	var message = getElementsByClassName(form.parentNode, "msg")[0];
	if(!/^[a-zA-Z0-9]+$/.test(userId)){
		message.innerHTML = "用户名格式不正确";
		return;
	}
	if(password.length < 6){
		message.innerHTML = "密码长度必须大于6位";
		return;
	}
	var xhr = new XMLHttpRequest();
	var url = "http://study.163.com/webDev/login.htm";
	url = addURLParam(url, "userName", md5(userId));
	url = addURLParam(url, "password", md5(password));
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){    
	       	if(xhr.responseText == 1){
	       		attention();
	       		closeLogin();
	       		setCookie("loginSuc", "loginSuc");
	       	}else{
	       		message.innerHTML = "登录失败";
	       	}  
	    }        
    }        
    xhr.open("get", url, true);      
    xhr.send(null);     
}

function attentionClick () {
    if(getCookie("loginSuc")){
        attention();
    }else{
        popLogin();
    }
}
function attention(){
    var xhr = new XMLHttpRequest();
    var url = "http://study.163.com/webDev/attention.htm";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){    
            if(xhr.responseText == 1){
                var father = document.querySelector(".g-hd .m-headline");
                father.querySelector(".m-btn").style.display = "none";
                father.querySelector(".u-followed").style.display = "block";
                father.querySelector(".fans").innerHTML = "粉丝&nbsp;46"
                setCookie("followSuc", "followSuc");
            } 
        }        
    }        
    xhr.open("get", url, true);      
    xhr.send(null);  
}   

function cancelAttention () {
    removeCookie("followSuc");
    var father = document.querySelector(".g-hd .m-headline");
    father.querySelector(".m-btn").style.display = "block";
    father.querySelector(".u-followed").style.display = "none";  
    father.querySelector(".fans").innerHTML = "粉丝&nbsp;45"
}

function addURLParam(url, key, value){
	url += url.indexOf("?") == -1 ? "?" : "&";
	url += encodeURIComponent(key) + "=" + encodeURIComponent(value);
	return url;
}


function closeMask () {
	getElementsByClassName(document, "m-mask")[0].style.display = "none";
}

function popMask () {
	getElementsByClassName(document, "m-mask")[0].style.display = "block";
}

function closeLogin () {
	getElementsByClassName(document, "m-form")[0].style.display = "none";
	closeMask();
}

function popLogin () {
	getElementsByClassName(document, "m-form")[0].style.display = "block";
	popMask();
}

function closeVideo () {
    getElementsByClassName(document, "m-video")[0].style.display = "none";
    closeMask();
    var video = document.getElementsByTagName("video")[0];
    video.pause();
}

function openVideo () {
    getElementsByClassName(document, "m-video")[0].style.display = "block";
    popMask();
}

function closeTop() {
	var top = getElementsByClassName(document, "g-top")[0];
	top.style.display = "none";
	setCookie("closeTop", "closeTop");
}

function checkTop () {
	if(getCookie("closeTop") == "closeTop"){
		getElementsByClassName(document, "g-top")[0].style.display = "none";
	};
}

function checkAttention(){
    if(getCookie("followSuc")){
        document.querySelector(".g-hd .m-headline .m-btn").style.display = "none";
        document.querySelector(".g-hd .m-headline .u-followed").style.display = "block";
    }else{
        document.querySelector(".g-hd .m-headline .m-btn").style.display = "block";
        document.querySelector(".g-hd .m-headline .u-followed").style.display = "none";       
    }
}

function showBanner(index){
    console.log("show" + index);
    var bannerParent = getElementsByClassName(document, "g-bd1 f-pr")[0];
    var bannerArray = bannerParent.getElementsByTagName("a");
    for (var i = 0; i < 3; i++){
        index == i ? bannerArray[i].className = "show" : bannerArray[i].className = "hide";
    }
    bannerArray[index].style.opacity = 0;
    for (i = 1; i <= 10; i++){
        (function(){
            var opacity = 0.1 * i;
            setTimeout(function(){
                bannerArray[index].style.opacity = opacity;
            }, 50 * i);
        })();
    }

}
function slide () {
    var controlParent = document.querySelector(".g-bd1 .control");
    var controlArray = controlParent.getElementsByTagName("p");
    var index = 0;
    addEvent(controlParent, "click", function(event){
        console.log("control clicked");
        event = event || window.event;
        var target = event.srcElement ? event.srcElement : event.target; 
        if (target == controlParent){
            return;
        }
        for (var i = 0; i < 3; i++){
            target == controlArray[i] ? controlArray[i].className = 'black' : controlArray[i].className = 'white';
        }
        if(index = getDataset(target).index){
            showBanner(index);
        }
    })
    var getHandle = function(){
        return setInterval(function(){
            index = ++index % controlArray.length;
            for (i = 0; i < 3; i++){
                index == i ? controlArray[i].className = 'black' : controlArray[i].className = 'white';
            }
            showBanner(index); 
        }, 5000);
    }
    var timerHandle = getHandle();
    var bd1 = getElementsByClassName(document, "g-bd1")[0];
    var img = getElementsByClassName(bd1, "m-img")[0];
    addEvent(img, "mouseover", function(){
        console.log("mouseover");
        clearInterval(timerHandle);
    });
    addEvent(img, "mouseout", function(){
        console.log("mouseout");
        timerHandle = getHandle();
    });

}
var loadCourse = (function(){
    var courseList = document.querySelector(".g-bd2 .m-courselist");
    var imgList = courseList.getElementsByTagName("img");
    var ssNameList = getElementsByClassName(courseList, "ssname");
    var ssProviderList = getElementsByClassName(courseList, "ssprovider");
    var ssLearnerCountList = getElementsByClassName(courseList, "sslearnercount");
    var priceList = getElementsByClassName(courseList, "price");
    var deNameList = getElementsByClassName(courseList, "dename");
    var detLearnercountList = getElementsByClassName(courseList, "detlearnercount");
    var deProviderList = getElementsByClassName(courseList, "provider");
    var categoryNameList = getElementsByClassName(courseList, "categoryName");
    var descriptionList = getElementsByClassName(courseList, "description");
    return function(pageNo, psize, type){
        var xhr = new XMLHttpRequest();
        var url = "http://study.163.com/webDev/couresByCategory.htm";
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){    
                var courseHub = JSON.parse(xhr.responseText)
                // console.log(courseHub);
                var coursePerPage = getCoursePerPage();
                for (var i = 0, j = 0; i < coursePerPage; i++){
                    imgList[2*i].src = imgList[2*i + 1].src = courseHub.list[i].middlePhotoUrl;
                    ssNameList[i].innerHTML = deNameList[i].innerHTML = courseHub.list[i].name;
                    ssProviderList[i].innerHTML = deProviderList[i].innerHTML = courseHub.list[i].provider;
                    ssLearnerCountList[i].innerHTML = detLearnercountList[i].innerHTML = 
                        courseHub.list[i].learnerCount < 10000 ? courseHub.list[i].learnerCount : "10k+";
                    priceList[i].innerHTML = "¥" + courseHub.list[i].price;
                    categoryNameList[i].innerHTML = "分类：" + (courseHub.list[i].categoryName == null 
                        ? "无" : courseHub.list[i].categoryName);
                    descriptionList[i].innerHTML = courseHub.list[i].description;
                    detLearnercountList[i].innerHTML += "人在学";
                    deProviderList[i].innerHTML = "发布者：" + deProviderList[i].innerHTML;
                }
            }        
        }   
        url = addURLParam(url, "pageNo", pageNo);
        url = addURLParam(url, "psize", psize);
        url = addURLParam(url, "type", type);     
        xhr.open("get", url, true);      
        xhr.send(null);  
        }
// 
})();

function getCoursePerPage(){
    var twenty = document.getElementById("signal");
    if (window.getComputedStyle(twenty).display == "none"){
        return 15;
    }else{
        return 20;
    }
    
}

(function(){
    var type = 10;
    var pageContainer = document.querySelector(".g-bd2 .m-page ul");
    var indexList = pageContainer.getElementsByTagName("li");
    var pageCache = {};
    pageCache["10"] = pageCache["20"] = 1;
    addEvent(document.querySelector(".g-bd2 .m-tab"), "click", function(event){
        console.log("tab clicked");
        event = event || window.event;
        var target = event.srcElement ? event.srcElement : event.target; 

        if(target.className.indexOf("design") != -1){
            if(type == 20){
                type = 10;
                loadCourse(pageCache[type], getCoursePerPage(), type);
            }
        }else if(target.className.indexOf("language") != -1){
            if(type == 10){
                type =20;
                loadCourse(pageCache[type], getCoursePerPage(), type);
            }
        }
        greenPageIndex()
    })

    addEvent(pageContainer, "click", function(event){
        event = event || window.event;
        var target = event.srcElement ? event.srcElement : event.target; 
        console.log(getDataset(target).index);
        var currentIndex = getDataset(target).index;
        if(currentIndex == undefined){
            return;
        }else if(currentIndex == 0){
            if(pageCache[type] == 1){
                return;
            }else{
                loadCourse(--pageCache[type], getCoursePerPage(), type);
            }
        }else if(currentIndex == 100){
            if(pageCache[type] == 8){
                return;
            }else{
                loadCourse(++pageCache[type], getCoursePerPage(), type);
            }
        }else{
            pageCache[type] = getDataset(target).index;
            loadCourse(pageCache[type], getCoursePerPage(), type);
        }
        greenPageIndex()
        
    })

    function greenPageIndex(){
            for(var i = 0; i < indexList.length - 2; i++){
            j = i + 1;
            if(pageCache[type] == getDataset(indexList[j]).index){
                indexList[j].className = "current f-fr";
            }else{
                indexList[j].className = "f-fr";
            }
        }
    }
})();

function hotList(){
    var courseList = document.querySelector(".g-bd2 .m-side .m-hot .m-hotlist");
    var imgList = courseList.getElementsByTagName("img");
    var nameList = getElementsByClassName(courseList, "head");
    var learnerCountList = getElementsByClassName(courseList, "count");
    var totalCourseCount = getHotLength();
    console.log(learnerCountList.length);
    var rollIndex = 0;
    var courseHub = null;
    var xhr = new XMLHttpRequest();
    var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){    
            courseHub = JSON.parse(xhr.responseText)
            console.log(courseHub);
            roll()
        }        
    }      
    xhr.open("get", url, true);      
    xhr.send(null);  
    
    function roll () {
        if(!courseHub){
            return;
        }
        rollIndex = ++rollIndex % totalCourseCount;
        for (var i = 0; i < 10; i++){
            var myIndex = (i + rollIndex) % totalCourseCount;
            imgList[i].src = courseHub[myIndex].smallPhotoUrl;
            nameList[i].innerHTML = courseHub[myIndex].name;
            learnerCountList[i].innerHTML = courseHub[myIndex].learnerCount;
        }

    }
    setInterval(roll, 5000);
} 

function getHotLength () {
    return 20;
}







window.onload = function(){
	console.log("window onload");
	checkTop();
    checkAttention();
    slide();
    loadCourse(1, getCoursePerPage(), 10);
    hotList();
}






















