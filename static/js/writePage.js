var width = 0;
var height = 0;
const toolsHeight = $('.blog-tools').height();
var paragraphSelected, nodeSelected, offsetSelected, textSelected;

function updateWindowSize() {
	// Get the dimensions of the viewport
	width = window.innerWidth ||
							document.documentElement.clientWidth ||
							document.body.clientWidth;
	height = window.innerHeight ||
							 document.documentElement.clientHeight ||
							 document.body.clientHeight;

	if (width > 920) {
		
	}
	else if (width > 680) {
		
	}
	else {
	
	}
};
window.addEventListener("load", updateWindowSize);  // When the page first loads
window.addEventListener("resize", updateWindowSize);  // When the browser changes size

$(function() {
  //toolsHeight = $('.blog-tools').height();
});

$('.blog-body').on('DOMCharacterDataModified', function(event) {
  var selection = window.getSelection();
  var range = document.createRange();

  if ($(event.target).text().startsWith('- ') || $(event.target).text().startsWith('1. ')) {
    var listDec = false;
    if ($(event.target).text().startsWith('- ')) {
      var text = '<span class="list-item">' + $(event.target).text().split('- ')[1] + '</span>';
    } else if ($(event.target).text().startsWith('1. ')) {
      var text = '<span class="list-item list-decimal">' + $(event.target).text().split('1. ')[1] + '</span>';
      listDec = true;
    }
    $(event.target).html(text);
    
    if ((!listDec && $(event.target).prev().children('.list-item').length > 0 
          && $(event.target).prev().children('.list-decimal').length == 0) ||
        (listDec && $(event.target).prev().children('.list-decimal').length > 0)) {
      $($(event.target).children()).detach().appendTo($(event.target).prev());
      range.setStart($(event.target).prev().children(':last')[0], 1);
      $(event.target).remove();
    } else {
      range.setStart(event.target, 1);
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

$('.blog-body').keydown(function(event) {
  var selection = window.getSelection();
  var selectionNode = selection.focusNode;
  var range = document.createRange();
  var paragraph = '<p><br></p>';

  if ($(selectionNode).parents('.head').length > 0)
    selectionNode = $(selectionNode).parents('.head');
  else if ($(selectionNode).parents('.sub-head').length > 0)
    selectionNode = $(selectionNode).parents('.sub-head');
  else if ($(selectionNode).parents('.list-item').length > 0)
    selectionNode = $(selectionNode).parents('.list-item');

  if (event.keyCode == 13) {  // Enter
    console.log(selectionNode);

    if ($(selectionNode).is('.head') || $(selectionNode).is('.sub-head')) {
      if ($(selectionNode).text().length == selection.focusOffset) {
        $(paragraph).insertAfter($(selectionNode));

        range.setStart($(selectionNode).next()[0], 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return false;
      }
    } else if ($(selectionNode).is('.list-item')) {
      if ($(selectionNode).text() == '') {
        $(paragraph).insertAfter($(selectionNode).parents('p'));
        
        if ($(selectionNode).next().is('.list-item')) {
          $($(selectionNode).parents('p').next()).replaceWith('<p></p>');
          $($(selectionNode).nextAll()).detach().appendTo($(selectionNode).parents('p').next());
          $(paragraph).insertAfter($(selectionNode).parents('p'));
        }
        
        range.setStart($(selectionNode).parents('p').next()[0], 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        $(selectionNode).remove();
        return false;
      }
    }
  } else if (event.keyCode == 8) {  // Backspace
    console.log($(selectionNode).text());

    if ($(selectionNode).is('p') && $(selectionNode).text() == '') {
      if ($(selectionNode).prev().children('.list-item').length > 0 &&
          $(selectionNode).next().children('.list-item').length > 0) {
        range.setStart($(selectionNode).prev().children(':last')[0], 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        $($(selectionNode).next().children('.list-item')).detach().appendTo($(selectionNode).prev());
        $(selectionNode).next().remove()
        $(selectionNode).remove()
        return false;
      }
    } else if ($(selectionNode).parents('p')[0] != $(selectionNode).prev().parents('p')[0]) {
      if ($(selectionNode).is('.list-item') && selection.focusOffset == 0) {

        if ($(selectionNode).next().is('.list-item')) {
          $('<p></p>').insertAfter($(selectionNode).parents('p'));
          $($(selectionNode).nextAll()).detach().appendTo($(selectionNode).parents('p').next());
        }
        
        $(selectionNode).replaceWith($(selectionNode).html());
        return false;
      }
    }
  }

});

/*$(document).mouseup(function(event) {
  console.log(document.getSelection().rangeCount);
  var selectionText = window.getSelection().toString();
  var selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
  var windowRect = document.body.parentNode.getBoundingClientRect();
  console.log(selectionText);
  if ($(event.target).is($('.blog-body').find('*')) && (selectionText != '')) {
    $('.blog-tools').not('#add').css({  // Set the Toolbar Position
      top: (selectionRect.top - windowRect.top - toolsHeight * 0.75) + 'px',
      left: (selectionRect.left + (selectionRect.width * 0.5)) + 'px',
      display: 'flex'
    }).hide().fadeIn(200);
  } else {
    $('.blog-tools').fadeOut(200);
  }

});*/

document.onselectionchange = function() {
  var selection = window.getSelection();
  var windowRect = document.body.parentNode.getBoundingClientRect();
  
  if (document.querySelector('.blog-body').contains(selection.anchorNode)  //selection begins
      && document.querySelector('.blog-body').contains(selection.focusNode)  //selection ends
      && !selection.isCollapsed) {
    var selectionRect = selection.getRangeAt(0).getBoundingClientRect();
    
    var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
    var backward = false;
    // position == 0 if nodes are the same
    if (!position && selection.anchorOffset > selection.focusOffset || 
        position === Node.DOCUMENT_POSITION_PRECEDING)
      backward = true;
    
    paragraphSelected = [selection.anchorNode, selection.focusNode];
    for (let i = 0; i < paragraphSelected.length; i++) {
      if (($(paragraphSelected[i]).parent('.head').length > 0)
          || ($(paragraphSelected[i]).parent('.sub-head').length > 0)
          || ($(paragraphSelected[i]).parent('p').length > 0))
        paragraphSelected[i] = paragraphSelected[i].parentNode;
      else if ($(paragraphSelected[i]).parent('span').parent('.list-item').length > 0)
        paragraphSelected[i] = paragraphSelected[i].parentNode.parentNode.parentNode;
      else
        paragraphSelected[i] = paragraphSelected[i].parentNode.parentNode;
    }
    
    nodeSelected = [selection.anchorNode, selection.focusNode];
    offsetSelected = [selection.anchorOffset, selection.focusOffset];
    if (backward) {
      paragraphSelected = paragraphSelected.reverse();
      nodeSelected = nodeSelected.reverse();
      offsetSelected = offsetSelected.reverse();
    }
    //console.log(selection);
    //console.log(offsetSelected);
    
    $('.blog-tools').not('#add').css({  // Set the Toolbar Position
      top: (selectionRect.top - windowRect.top - toolsHeight * 0.75) + 'px',
      left: (selectionRect.left + (selectionRect.width * 0.5)) + 'px',
      display: 'flex'
    }).hide().fadeIn(200);
  } else {
    $('.blog-tools').fadeOut(200);
  }
};

$('.blog-body').contextmenu(function(event) {
  $('#add').css({
    top: (event.pageY - toolsHeight * 0.75) + 'px',
    left: event.pageX + 'px',
    display: 'flex'
  }).hide().fadeIn(200);
});

$('.blog-tools i').click(function() {
  var selection = window.getSelection();
  var range = document.createRange();
  
  if ($(this).hasClass('fa-bold')) {
    if (isNotAdaptText('bold')) addClassAdaptText('bold');
    else removeClassAdaptText('bold');
  } else if ($(this).hasClass('fa-italic')) {
    if (isNotAdaptText('italic')) addClassAdaptText('italic');
    else removeClassAdaptText('italic');
  } else if ($(this).hasClass('fa-underline')) {
    if (isNotAdaptText('underline')) addClassAdaptText('underline');
    else removeClassAdaptText('underline');
  } else if ($(this).hasClass('fa-lg') && $(this).hasClass('fa-heading')) {
    console.log('is sub head part, not head all');
    console.log(!isNotHead('sub-head'), isNotHead('head'));
    if (!isNotHead('sub-head')) { addOrRemoveHead('sub-head', isAdd = false); addOrRemoveHead('head'); }
    else if (isNotHead('head')) addOrRemoveHead('head');
    else addOrRemoveHead('head', isAdd = false);
  } else if ($(this).hasClass('fa-heading')) {
    console.log('is head part, not sub head all');
    console.log(!isNotHead('head'), isNotHead('sub-head'));
    if (!isNotHead('head')) { addOrRemoveHead('head', isAdd = false); addOrRemoveHead('sub-head'); }
    else if (isNotHead('sub-head')) addOrRemoveHead('sub-head');
    else addOrRemoveHead('sub-head', isAdd = false);
  } else if ($(this).hasClass('fa-link')) {
    if (isNotAdaptText('underline')) addClassAdaptText('underline');
    else removeClassAdaptText('underline');
  }

  /*range.setStart(nodeSelected[0], 0);
  range.setEnd(nodeSelected[1], 1);
  selection.removeAllRanges();
  selection.addRange(range);*/
  $('.blog-tools').not('#add').fadeIn(0);
});


$.fn.replaceWithPush = function(a) {
  var $a = $(a);
  this.replaceWith($a);
  return $a;
};

$.fn.afterPush = function(a) {
  var $a = $(a);
  this.after($a);
  return $a;
};

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

function isNotAdaptText(selectedClassName) {
  if (nodeSelected[0] == nodeSelected[1]) {
    if (nodeSelected[0].parentNode.className.search(selectedClassName) == -1)
      return true;
  } else {
    var elementText, start = false, end = false, xtart = false;
    var blogBody = $('.blog-body').children();
    
    for (let i = 0; i < blogBody.length ; i++) {
      if (blogBody[i] == paragraphSelected[0]) xtart = true; 
      if (!xtart) continue;

      if (blogBody[i].nodeName == 'P') {
        var allChildNodes = Array.from(blogBody[i].childNodes);
        allChildNodes = allChildNodes.filter(value => { return value.textContent.search('\n        '); });
        for (let j = 0; j < allChildNodes.length; j++) {
          el = allChildNodes[j];
          if ($(el).is('.list-item')) {
            for(let k = 0; k < el.childNodes.length; k++)
              allChildNodes.insert(j + k, el.childNodes[k]);
            allChildNodes.splice(el.childNodes.length + j, 1);
            el = el.childNodes[0]
            //console.log(allChildNodes)
            //return;
          }
          elementText = (el.nodeName == '#text') ? el : el.childNodes[0];
          if (elementText == nodeSelected[0]) {
            start = true;
            if (el.className == undefined) return true;
            if (el.className.search(selectedClassName) == -1) return true;
          } else if (elementText == nodeSelected[1]) {
            end = true;
            if (el.className == undefined) return true;
            if (el.className.search(selectedClassName) == -1) return true;
          } else if (start && !end) {
            if (el.className == undefined) return true;
            if (el.className.search(selectedClassName) == -1) return true;
          }
        }
      }

      if (paragraphSelected[0] == paragraphSelected[1]) break;
      if (blogBody[i] == paragraphSelected[1]) break;
    }
  }
  return false;
}

function isNotHead(selectedClassName) {
  if (nodeSelected[0] == nodeSelected[1]) {
    if (paragraphSelected[0].className != selectedClassName)
      return true;
  } else {
    var xtart = false;
    var blogBody = $('.blog-body').children();
    
    for (let i = 0; i < blogBody.length ; i++) {
      if (blogBody[i] == paragraphSelected[0]) xtart = true; 
      if (!xtart) continue;

      if (blogBody[i].nodeName == 'P') 
        return true;
      else if (blogBody[i].className != selectedClassName)
        return true;

      if (paragraphSelected[0] == paragraphSelected[1]) break;
      if (blogBody[i] == paragraphSelected[1]) break;
    }
  }
  return false;
}

function addClassAdaptText(className) {
  var elementClass, textToReplace;
  if (nodeSelected[0] == nodeSelected[1]) {
    textToReplace = '<span>' + nodeSelected[0].textContent.slice(0, offsetSelected[0]) + '</span>'
                    + '<span>' + nodeSelected[0].textContent.slice(offsetSelected[0], offsetSelected[1]) + '</span>'
                    + '<span>' + nodeSelected[0].textContent.slice(offsetSelected[1]) + '</span>';
    if ($(nodeSelected[0]).parents('span').not('.list-item').length > 0) {
      elementClass = nodeSelected[0].parentNode.className.trim().split(" ");
      x = $(nodeSelected[0].parentNode).replaceWithPush(textToReplace);
    } else {
      elementClass = undefined;
      x = $(nodeSelected[0]).replaceWithPush(textToReplace);
    }
    if (elementClass != undefined) {
      $(x[0]).addClass(elementClass.sort().join(" "));
      $(x[2]).addClass(elementClass.sort().join(" "));
      elementClass.push(className);
      $(x[1]).addClass(elementClass.sort().join(" "));
    } else {
      $(x[0]).replaceWith(x[0].textContent);
      $(x[2]).replaceWith(x[2].textContent);
      $(x[1]).addClass(className);
    }
    nodeSelected[0] = x[1];
    nodeSelected[1] = x[1];
  } else {
    var elementText, start = false, end = false, xtart = false;
    var blogBody = $('.blog-body').children();
    for (let i = 0; i < blogBody.length ; i++) {
      if (blogBody[i] == paragraphSelected[0]) xtart = true; 
      if (!xtart) continue;

      if (blogBody[i].nodeName == 'P') {
        var allChildNodes = Array.from(blogBody[i].childNodes);
        allChildNodes = allChildNodes.filter(value => { return value.textContent.search('\n        '); });
        for (let j = 0; j < allChildNodes.length; j++) {
          el = allChildNodes[j];
          if ($(el).is('.list-item')) {
            for(let k = 0; k < el.childNodes.length; k++)
              allChildNodes.insert(j + k, el.childNodes[k]);
            allChildNodes.splice(el.childNodes.length + j, 1);
            el = el.childNodes[0]
          }
          elementText = (el.nodeName == '#text') ? el : el.childNodes[0];
          textToReplace = el.textContent;
          elementClass = (el.className != undefined) ? el.className.trim().split(" ") : undefined;
          if (elementText == nodeSelected[0]) {
            start = true;
            textToReplace = '<span>' + textToReplace.slice(0, offsetSelected[0]) + '</span>'
                            + '<span>' + textToReplace.slice(offsetSelected[0]) + '</span>';
            x = $(el).replaceWithPush(textToReplace);
            if (elementClass != undefined) {
              $(x[0]).addClass(elementClass.sort().join(" "));
              elementClass.push(className);
              $(x[1]).addClass(elementClass.sort().join(" "));
            } else {
              $(x[0]).replaceWith(x[0].textContent);
              $(x[1]).addClass(className);
            }
            nodeSelected[0] = x[1];
          } else if (elementText == nodeSelected[1]) {
            end = true;
            textToReplace = '<span>' + textToReplace.slice(0, offsetSelected[1]) + '</span>'
                            + '<span>'+ textToReplace.slice(offsetSelected[1]) + '</span>';
            x = $(el).replaceWithPush(textToReplace);
            if (elementClass != undefined) {
              $(x[1]).addClass(elementClass.sort().join(" "));
              elementClass.push(className);
              $(x[0]).addClass(elementClass.sort().join(" "));
            } else {
              $(x[1]).replaceWith(x[1].textContent);
              $(x[0]).addClass(className);
            }
            nodeSelected[1] = x[0];
          } else if (start && !end) {
            textToReplace = '<span>' + textToReplace +'</span>';
            if (elementClass != undefined) {
              elementClass.push(className);
              $($(el).replaceWithPush(textToReplace)[0]).addClass(elementClass.sort().join(" "));
            } else {
              $($(el).replaceWithPush(textToReplace)[0]).addClass(className);
            }
          }
        };
      }

      if (paragraphSelected[0] == paragraphSelected[1]) break;
      if (blogBody[i] == paragraphSelected[1]) break;
    };
  }
  mergeSameSpan();
  return 0;
}

function removeClassAdaptText(className) {
  var elementClass, textToReplace;
  if (nodeSelected[0] == nodeSelected[1]) {
    textToReplace = '<span>' + nodeSelected[0].textContent.slice(0, offsetSelected[0]) + '</span>'
                    + '<span>' + nodeSelected[0].textContent.slice(offsetSelected[0], offsetSelected[1]) + '</span>'
                    + '<span>' + nodeSelected[0].textContent.slice(offsetSelected[1]) + '</span>';
    elementClass = ($(nodeSelected[0]).parents('span').not('.list-item').length > 0) ? 
                    nodeSelected[0].parentNode.className.trim().split(" ") : undefined;
    if (elementClass != undefined) {
      x = $(nodeSelected[0].parentNode).replaceWithPush(textToReplace);
      $(x[0]).addClass(elementClass.sort().join(" "));
      $(x[2]).addClass(elementClass.sort().join(" "));
      elementClass = elementClass.filter(value => { return value != className; });
      if (elementClass.length > 0) $(x[1]).addClass(elementClass.sort().join(" "));
      else $(x[1]).replaceWith(x[1].textContent);
    }
    nodeSelected[0] = x[1];
    nodeSelected[1] = x[1];
  } else {
    var elementText, start = false, end = false, xtart = false;
    var blogBody = $('.blog-body').children();
    for (let i = 0; i < blogBody.length ; i++) {
      if (blogBody[i] == paragraphSelected[0]) xtart = true; 
      if (!xtart) continue;

      if (blogBody[i].nodeName == 'P') {
        var allChildNodes = Array.from(blogBody[i].childNodes);
        allChildNodes = allChildNodes.filter(value => { return value.textContent.search('\n        '); });
        for (let j = 0; j < allChildNodes.length; j++) {
          el = allChildNodes[j];
          if ($(el).is('.list-item')) {
            for(let k = 0; k < el.childNodes.length; k++)
              allChildNodes.insert(j + k, el.childNodes[k]);
            allChildNodes.splice(el.childNodes.length + j, 1);
            el = el.childNodes[0]
          }
          elementText = (el.nodeName == '#text') ? el : el.childNodes[0];
          textToReplace = el.textContent;
          elementClass = (el.className != undefined) ? el.className.trim().split(" ") : undefined;
          if (elementText == nodeSelected[0]) {
            start = true;
            textToReplace = '<span>' + textToReplace.slice(0, offsetSelected[0]) + '</span>'
                            + '<span>' + textToReplace.slice(offsetSelected[0]) + '</span>';
            if (elementClass != undefined) {
              x = $(el).replaceWithPush(textToReplace);
              $(x[0]).addClass(elementClass.sort().join(" "));
              elementClass = elementClass.filter(value => { return value != className; });
              if (elementClass.length > 0) $(x[1]).addClass(elementClass.sort().join(" "));
              else $(x[1]).replaceWith(x[1].textContent);
            }
            nodeSelected[0] = x[1];
          } else if (elementText == nodeSelected[1]) {
            end = true;
            textToReplace = '<span>' + textToReplace.slice(0, offsetSelected[1]) + '</span>'
                            + '<span>'+ textToReplace.slice(offsetSelected[1]) + '</span>';
            if (elementClass != undefined) {
              x = $(el).replaceWithPush(textToReplace);
              $(x[1]).addClass(elementClass.sort().join(" "));
              elementClass = elementClass.filter(value => { return value != className; });
              if (elementClass.length > 0) $(x[0]).addClass(elementClass.sort().join(" "));
              else $(x[0]).replaceWith(x[0].textContent);
            }
            nodeSelected[1] = x[0];
          } else if (start && !end) {
            textToReplace = '<span>' + textToReplace +'</span>';
            if (elementClass != undefined) {
              x = $(el).replaceWithPush(textToReplace)
              elementClass = elementClass.filter(value => { return value != className; });
              if (elementClass.length > 0) $(x[0]).addClass(elementClass.sort().join(" "));
              else $(x[0]).replaceWith(x[0].textContent);
            }
          }
        };
      }

      if (paragraphSelected[0] == paragraphSelected[1]) break;
      if (blogBody[i] == paragraphSelected[1]) break;
    }
  }
  mergeSameSpan();
  return 0;
}

function mergeSameSpan() {
  var allChildNodes, previousEl, textToReplace;
  for (let i = 0; i < paragraphSelected.length ; i++) {
    allChildNodes = Array.from(paragraphSelected[i].childNodes);
    allChildNodes = allChildNodes.filter(value => { return value.textContent.search('\n        '); });
    for (let j = 0; j < allChildNodes.length; j++) {
      el = allChildNodes[j];
      if ($(el).is('.list-item')) {
        for(let k = 0; k < el.childNodes.length; k++)
          allChildNodes.insert(j + k, el.childNodes[k]);
        allChildNodes.splice(el.childNodes.length + j, 1);
        el = el.childNodes[0] 
      }
      previousEl = el.previousSibling;
      if (el.textContent == '') { el.remove(); continue; }
      if (previousEl == null) continue;

      if ((el.nodeName == previousEl.nodeName) && (el.className == previousEl.className)) {
        previousEl.remove();
        if (el.className != undefined) {
          textToReplace = '<span>' + previousEl.textContent + el.textContent + '</span>';
          $($(el).replaceWithPush(textToReplace)[0]).addClass(el.className);
        } else {
          textToReplace = previousEl.textContent + el.textContent;
          $(el).replaceWith(textToReplace);
        }
      }
    }

    if (paragraphSelected[0] == paragraphSelected[1]) break;
  }
}

function addOrRemoveHead(className, isAdd = true) {
  var start = false, xtart = false;
  var blogBody = $('.blog-body').children();
  var allChildNodes, contents, headSpan;
  for (let i = 0; i < blogBody.length ; i++) {
    if (blogBody[i] == paragraphSelected[0]) xtart = true; 
    if (!xtart) continue;
    
    allChildNodes = Array.from(blogBody[i].childNodes);
    for (let j = 0; j < allChildNodes.length ; j++) {
      if (allChildNodes[j].className != undefined) {
        if (allChildNodes[j].className.search('bold') > -1) {
          if (isAdd) $(allChildNodes[j]).css('font-weight', 'inherit');
          else $(allChildNodes[j]).css('font-weight', 'bold');
        } 
        if (allChildNodes[j].className.search('italic') > -1) {
          if (isAdd) $(allChildNodes[j]).css('font-style', 'inherit');
          else $(allChildNodes[j]).css('font-style', 'italic');
        } 
        if (allChildNodes[j].className.search('underline') > -1) {
          if (isAdd) $(allChildNodes[j]).css('text-decoration', 'inherit');
          else $(allChildNodes[j]).css('text-decoration', 'underline');
        }
      }
    }

    if (blogBody[i] == paragraphSelected[0]) {
      start = true;
      contents = $(blogBody[i]).contents();
    } else if (start) {
      contents = $(blogBody[i]).contents();
    }

    if (isAdd) {
      headSpan = $(blogBody[i]).replaceWithPush('<span></span>');
      $(headSpan).addClass(className);
    } else {
      headSpan = $(blogBody[i]).replaceWithPush('<p></p>');
    }
    $(headSpan).append(contents);

    if (paragraphSelected[0] == paragraphSelected[1]) {
      paragraphSelected[0] = headSpan[0];
      paragraphSelected[1] = headSpan[0];
      break;
    } else if (blogBody[i] == paragraphSelected[0]) {
      paragraphSelected[0] = headSpan[0];
    } else if (blogBody[i] == paragraphSelected[1]) {
      paragraphSelected[1] = headSpan[0];
      break;
    }
  }
  //console.log(paragraphSelected);
}

/*function isNotAdapt(selectedClassName, isHead = false) {
  if (nodeSelected[0] == nodeSelected[1]) {
    if (!isHead) {
      if (nodeSelected[0].parentNode.className.search(selectedClassName) == -1)
        return true;
    } else {
      if (paragraphSelected[0].className != selectedClassName)
        return true;
    }
  } else {
    var elementText, start = false, end = false, xtart = false;
    var blogBody = $('.blog-body').children();

    for (let i = 0; i < blogBody.length ; i++) {
      if (blogBody[i] == paragraphSelected[0]) xtart = true; 
      if (!xtart) continue;

      if (!isHead) {
        if (blogBody[i].nodeName == 'P') {
          var allChildNodes = Array.from(blogBody[i].childNodes);
          for (let j = 0; j < allChildNodes.length; j++) {
            el = allChildNodes[j];
            elementText = (el.nodeName == '#text') ? el : el.childNodes[0];
            if (elementText == nodeSelected[0]) {
              start = true;
              if (el.className == undefined) return true;
              if (el.className.search(selectedClassName) == -1) return true;
            } else if (elementText == nodeSelected[1]) {
              end = true;
              if (el.className == undefined) return true;
              if (el.className.search(selectedClassName) == -1) return true;
            } 
            
            if (start && !end) {
              if (el.className == undefined) return true;
              if (el.className.search(selectedClassName) == -1) return true;
            }
          }
        }
      } else {
        if (blogBody[i].nodeName == 'P') 
          return true;
        else if (blogBody[i].className != selectedClassName)
          return true;
      }

      if (paragraphSelected[0] == paragraphSelected[1]) break;
      if (blogBody[i] == paragraphSelected[1]) break;
    }
  }
  return false;
}*/

/*function addNewHead2(className) {
  var blogBody = $('.blog-body > p');
  var start = false, xtart = false;
  var contents, headSpan;
  for (let i = 0; i < blogBody.length ; i++) {
    if (blogBody[i] == paragraphSelected[0]) xtart = true; 
    if (!xtart) continue;
    allChildNodes = Array.from(blogBody[i].childNodes);
    for (let j = 0; j < allChildNodes.length ; j++) {
      if (allChildNodes[j].className == 'bold')
        $(allChildNodes[j]).css('font-weight', 'inherit');
      else if (allChildNodes[j].className == 'italic')
        $(allChildNodes[j]).css('font-style', 'inherit');
      else if (allChildNodes[j].className == 'underline')
        $(allChildNodes[j]).css('text-decoration', 'inherit');
    }

    if (blogBody[i] == paragraphSelected[0]) {
      start = true;
      contents = $(blogBody[i]).contents();
    } else if (start) {
      contents = $(blogBody[i]).contents();
    }
    headSpan = $(blogBody[i]).replaceWithPush('<span></span>');
    $(headSpan).addClass(className);
    $(headSpan).append(contents);

    if (paragraphSelected[0] == paragraphSelected[1]) break;
    if (blogBody[i] == paragraphSelected[1]) break;
  }
}*/

/*function removeHead2() {
  var blogBody = $('.blog-body > span'), allChildNodes;
  var start = false, xtart = false;
  var contents, headSpan;
  for (let i = 0; i < blogBody.length ; i++) {
    if (blogBody[i] == paragraphSelected[0]) xtart = true; 
    if (!xtart) continue;
    allChildNodes = Array.from(blogBody[i].childNodes);
    for (let j = 0; j < allChildNodes.length ; j++) {
      if (allChildNodes[j].className == 'bold')
        $(allChildNodes[j]).css('font-weight', 'bold');
      else if (allChildNodes[j].className == 'italic')
        $(allChildNodes[j]).css('font-style', 'italic');
      else if (allChildNodes[j].className == 'underline')
        $(allChildNodes[j]).css('text-decoration', 'underline');
    }

    if (blogBody[i] == paragraphSelected[0]) {
      start = true;
      contents = $(blogBody[i]).contents();
    } else if (start) {
      contents = $(blogBody[i]).contents();
    }
    headSpan = $(blogBody[i]).replaceWithPush('<p></p>');
    $(headSpan).append(contents);

    if (paragraphSelected[0] == paragraphSelected[1]) break;
    if (blogBody[i] == paragraphSelected[1]) break;
  }
}*/