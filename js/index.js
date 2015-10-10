'use strict';
var $ = require('jquery');

var requestAttr;
var onesky;

var init = function () {
  requestAttr = {
    platformId: $('.platformId').val(),
    publicKey: $('.publicKey').val(),
    privateKey: $('.privateKey').val(),
    locale: $('.locale').val()
  };
  onesky = require('onesky')(requestAttr.publicKey, requestAttr.privateKey);
}

var getResource = function () {
  init();

  return new Promise(function (resolve, reject) {
    onesky.string.output({
      platformId: requestAttr.platformId,
      locale: requestAttr.locale
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
};

var resourcesDisplay = function (data) {
  var resources = '<p>Main</p><table><tbody>';
  $.each(data.translation.main[requestAttr.locale], function (i, val) {
    resources += '<tr><td>' + i + '</td><td>' + val + '</td></tr>';
  });
  if (data.translation.Default) {
    resources += '</tbody></table><p>Default</p><table><tbody>';
    $.each(data.translation.Default[requestAttr.locale], function (i, val) {
      resources += '<tr><td>' + i + '</td><td>' + val + '</td></tr>';
    });
  }
  resources += '</tbody></table>';
  $('#main').html(resources);
}

var addResource = function () {

  var strings = {
    string: $('#string').val(),
    stringKey: $('#stringKey').val()
  };

  if (strings.string === '' || strings.stringKey === '') {
    $('#string, #stringKey').addClass('error').on('focus', function (e) {
      $(e.target).removeClass('error');
    });
    return true;
  };

  var conf = confirm('Would it be okay to register ?\n\n' + strings.string + ' : ' + strings.stringKey);
  if (conf) {
    $('#string, #stringKey').val('');
    $('#main').text('Loding...');
    onesky.string.input(requestAttr.platformId, strings, function (data) {
      setTimeout(function () {
        getResource()
          .then(function (data) {
            resourcesDisplay(data)
          })
          .catch(function (err) {
            $('#main').html(err);
          });
      }, 3000);
    });
  } else {
    return false;
  }
};

$('#getResource').on('click', function () {
  $('#main').text('Loding...');
  getResource()
    .then(function (data) {
      resourcesDisplay(data)
    })
    .catch(function (err) {
      $('#main').html(err);
    });
});

$('#addResourceTrigger, #cancel').on('click', function () {
  $('.ctrlBtns, .resourceInputs').toggleClass('show');
});

$('#addResource').on('click', function () {
  if (!addResource()) {
    $('.ctrlBtns, .resourceInputs').toggleClass('show');
  }
});

getResource()
  .then(function (data) {
    resourcesDisplay(data)
  })
  .catch(function (err) {
    $('#main').html(err);
  });