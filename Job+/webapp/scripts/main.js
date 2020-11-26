(function () {
    // dom elements
    var oAvatar = document.getElementById('avatar'),
        oWelcomeMsg = document.getElementById('welcome-msg'),
        oLogoutBtn = document.getElementById('logout-link'),

        oRegisterFormBtn = document.getElementById('register-form-btn'),
        oLoginBtn = document.getElementById('login-btn'),
        oLoginForm = document.getElementById('login-form'),
        oLoginUsername = document.getElementById('username'),
        oLoginPwd = document.getElementById('password'),
        oLoginFormBtn = document.getElementById('login-form-btn'),
        oLoginErrorField = document.getElementById('login-error'),

        oRegisterBtn = document.getElementById('register-btn'),
        oRegisterUsername = document.getElementById('register-username'),
        oRegisterPwd = document.getElementById('register-password'),
        oRegisterFirstName = document.getElementById('register-first-name'),
        oRegisterLastName = document.getElementById('register-last-name'),
        oRegisterForm = document.getElementById('register-form'),
        oRegisterResultField = document.getElementById('register-result'),

        oNearbyBtn = document.getElementById('nearby-btn'),
        oRecommendBtn = document.getElementById('recommend-btn'),
        oFavBtn = document.getElementById('fav-btn'),
        oNavBtnList = document.getElementsByClassName('main-nav-btn'),
        oItemNav = document.getElementById('item-nav'),
        oItemList = document.getElementById('item-list'),

        oTpl = document.getElementById('tpl').innerHTML,
        userId = '1111',
        userFullName = 'John',
        lng = -122.08,
        lat = 37.38,

        itemArr;

    function init(){
        console.log('init');
        // validation session -> after ajax
        validateSession();
        // to show login form
        // bind events
        bindEvent();
    }

    function validateSession() {
        // show login form +  hide the rest
        switchLoginRegister('login');
    }

    function bindEvent() {
        oRegisterFormBtn.addEventListener('click', function() {
            // console.log('click register');
            switchLoginRegister('register');
        }, false);

        oLoginFormBtn.addEventListener('click', function() {
            // console.log('click login');
            switchLoginRegister('login');
        }, false);

        // click login btn
        oLoginBtn.addEventListener('click', loginExecutor, false);

        // click item btn
        oItemList.addEventListener('click', changeFavoriteItems, false);

        // favorite btn click
        oFavBtn.addEventListener('click', loadFavoriteItems, false);

        //nearby btn click
        oNearbyBtn.addEventListener('click', loadNearbyData, false);

        // recommendation btn click
        oRecommendBtn.addEventListener('click', loadRecommendedItems, false);

        oRegisterBtn.addEventListener('click', registerExecutor, false);
    }

    function loginExecutor() {
        var username = oLoginUsername.value,
            password = oLoginPwd.value;

        if(username === '' || password === '') {
            oLoginErrorField.innerHTML = 'Please fill in all fields';
            return;
        }

        password = md5(username + md5(password));
        console.log(username, password);
        // ajax -> server username/pwd validation
        ajax({
            method: 'POST',
            url: './login',
            data: {
                user_id: username,
                password: password
            },
            success: function(res){
                console.log(res);
                if(res.status === 'OK') {
                    // show welcome msg
                    welcomeMsg(res);

                    //fetch data
                    fetchData();
                }
            },
            error: function() {
                throw new Error('Invalid username or password');
            }
        })
    }

    function registerExecutor() {
        var username = oRegisterUsername.value,
            password = oRegisterPwd.value,
            firstName = oRegisterFirstName.value,
            lastName = oRegisterLastName.value;

        if (username === "" || password == "" || firstName === ""
            || lastName === "") {
            oRegisterResultField.innerHTML = 'Please fill in all fields';
            return;
        }

        if (username.match(/^[a-z0-9_]+$/) === null) {
            oRegisterResultField.innerHTML = 'Invalid username';
            return;
        }
        password = md5(username + md5(password));

        ajax({
            method: 'POST',
            url: './register',
            data: {
                user_id : username,
                password : password,
                first_name : firstName,
                last_name : lastName,
            },
            success: function (res) {
                if (res.status === 'OK' || res.result === 'OK') {
                    oRegisterResultField.innerHTML = 'Successfully registered!'
                } else {
                    oRegisterResultField.innerHTML = 'User already existed!'
                }
            },
            error: function () {
                //show login error
                throw new Error('Failed to register');
            }
        })
    }

    function loadRecommendedItems() {
        activeBtn('recommend-btn');
        var opt = {
            method: 'GET',
            url: './recommendation?user_id=' + userId + '&lat=' + lat + '&lon=' + lng,
            data: null,
            message: 'recommended'
        }
        serverExecutor(opt);
    }

    function loadFavoriteItems () {
        activeBtn('fav-btn');

        var opt = {
            method: 'GET',
            url: './history?user_id=' + userId,
            data: null,
            message: 'favorite'
        }

        serverExecutor(opt);
    }

    // change favorite
    function changeFavoriteItems(evt) {
        console.log('change items');
        var tar = evt.target,
            oParent = tar.parentElement;

        if(oParent && oParent.className === 'fav-link') {
            console.log(oParent)
            // unset/set favorite on the server
            // url - ok
            // item data <- item list + cur item index
            var oCurLi = oParent.parentElement,
                classname = tar.className,
                isFavorite = classname === 'fa fa-heart' ? true : false,
                oItems = document.getElementsByClassName('item'),
                index = Array.prototype.indexOf.call(oItems, oCurLi),
                url = './history',
                req = {
                    user_id: userId,
                    favorite: itemArr[index]
                };

            var method = !isFavorite ? 'POST' : 'DELETE';

            //send data to the server
            ajax({
                method: method,
                url: url,
                data: req,
                success: function (res) {
                    console.log(res);
                    //case1: success

                    if(res.status === 'SUCCESS' || res.result === 'SUCCESS') {
                        // change icon
                        tar.className = !isFavorite ? 'fa fa-heart' : 'fa fa-heart-o';
                    } else {
                        //case2: fail
                        throw new Error('Change favorite failed!')
                    }
                },
                error: function () {
                    throw new Error('Change favorite failed!')
                }
            })
        }
    }

    function fetchData() {
        // geolocation
        initGeo(loadNearbyData);
    }

    function loadNearbyData() {
        activeBtn('nearby-btn');
        var opt = {
            method: 'GET',
            url: './search?user_id=' + userId + '&lat=' + lat + '&lon=' + lng,
            data: null,
            message: 'nearby'
        }

        // fetch nearby data
        serverExecutor(opt);
    }

    function serverExecutor(opt) {
        oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i>Loading ' + opt.message + ' item...</p>';
        ajax({
            method: opt.method,
            url: opt.url,
            data: opt.data,
            success: function(res) {
                console.log(res);
                // case1: dataset is null || empty
                if(!res || res.length === 0) {
                    oItemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> No '+ opt.message +' item!</p>';
                } else {
                    //case2: dataset is not empty
                    //render data
                    render(res);
                    itemArr = res;
                }

            },
            error: function() {
                throw new Error('No ' + opt.message + 'data!')
            }
        })
    }

    function render(data) {
        var len = data.length,
            list = '',
            item;

        for(var i = 0; i < len; i++) {
            item = data[i];
            console.log(item)
            list += oTpl.replace(/{{(.*?)}}/g, function (node, key) {
                if(key === 'location') {
                    return item[key].replace(/,/g, '<br />').replace(/\"/, '');
                }

                if(key === 'company_logo') {
                    return item[key] || 'https://via.placeholder.com/100';
                }

                if(key === 'favorite') {
                    return item[key] ? 'fa fa-heart' : 'fa fa-heart-o';
                }
                return item[key];
            })
        }
        oItemList.innerHTML = list;
    }
    function activeBtn(btnId) {
        var len = oNavBtnList.length;
        for (var i = 0; i < len; i++) {
            // remove active
            oNavBtnList[i].className = 'main-nav-btn';
        }
        var btn = document.getElementById(btnId);
        btn.className += ' active';
    }

    function initGeo(cb) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // lat = position.coords.latitude || lat;
                // lng = position.coords.longitude || lng;
                lng = -122;
                lat = 47;
                cb()
            }, function() {
                throw new Error('Geo location fetch failed!!')
            }, {maximumAge: 60000})
        }
    }
    function welcomeMsg(msg) {
        userId = msg.user_id;
        userFullName = msg.name;

        //show header
        oWelcomeMsg.innerHTML = 'Welcome ' + userFullName;
        showOrHideElement(oWelcomeMsg, 'block');
        showOrHideElement(oAvatar, 'block');
        showOrHideElement(oItemNav, 'block');
        showOrHideElement(oItemList, 'block');
        showOrHideElement(oLogoutBtn, 'block');

        //hide login form
        showOrHideElement(oLoginForm, 'none');
    }

    function switchLoginRegister(name) {
        // hide header
        showOrHideElement(oAvatar, 'none');
        showOrHideElement(oWelcomeMsg, 'none');
        showOrHideElement(oLogoutBtn, 'none');

        //hide item list
        showOrHideElement(oItemNav, 'none');
        showOrHideElement(oItemList, 'none');

        // case1: name == login
        if(name === 'login') {
            // hide register
            showOrHideElement(oRegisterForm, 'none');
            // clear register error
            oRegisterResultField.innerHTML = '';
            // show login
            showOrHideElement(oLoginForm, 'block');
        } else {
            //case2: name == register

            // hide login
            showOrHideElement(oLoginForm, 'none');
            // clear login err msg
            oLoginErrorField.innerHTML = '';

            //show register
            showOrHideElement(oRegisterForm, 'block');
        }

    }

    function showOrHideElement(ele, style) {
        // css -> display
        ele.style.display = style;
    }

    /**
     * AJAX helper
     */
    function ajax(opt) {
        var opt = opt || {},
            method = (opt.method || 'GET').toUpperCase(),
            url = opt.url,
            data = opt.data || null,
            success = opt.success || function() {},
            error = opt.error || function() {},
            // step1: create
            xhr = new XMLHttpRequest();

        // error checking
        if(!url) {
            throw new Error('missing url');
        }

        //step2: configuration
        xhr.open(method, url, true);
        //step3: send
        if(!data) {
            xhr.send();
        } else {
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhr.send(JSON.stringify(data));
        }

        //step4: listener
        // case1: success
        xhr.onload = function () {
            // check response
            if(xhr.status === 200) {
                success(JSON.parse(xhr.responseText))
            }
        }
        //case2: fail
        xhr.onerror = function () {
            error();
            throw new Error('The request could not be completed.');
        }
    }
    // entry fn - init fn
    init();
})()


// switch login / register
// login + register api
// data from server
// render data - template
// nearby favorite recommendation
// change favorite
