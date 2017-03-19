
var family = [];
var counter = 0;

window.onload = function() {
  displayFamilySection();
  addButton();
  submitButton();
}

function addButton() {
  document.getElementsByTagName('button')[0].addEventListener("click", function() {
    var form = document.querySelector('form');
    if (validateFields(form[0].value, form[1].value)) {
      addFamilyMember(form);
      counter++;
    }
    document.querySelector('form').reset();
  });
}

function submitButton() {
  document.getElementsByTagName('button')[1].addEventListener("click", function() {
    submitFamily();
  });
}

function addFamilyMember(form) {
  event.preventDefault();
  if (event.target.className.includes('submitted')) {
    counter = 0;
    var listItems = document.getElementById('family_members').children
    for (var i = 0; i < listItems.length; i++) {
      if (listItems[i].nodeName == 'UL') {
        counter++;
      }
    }
  }
  var newFamilyMember = createFamilyMember(form);
  family.push(newFamilyMember);
  appendMemberToFamily(newFamilyMember);
}

function createFamilyMember(form) {
  var familyMember = {}
  familyMember["age"] = form[0].value
  familyMember["rel"] = form[1].value
  familyMember["smoker"] = form[2].checked ? 'yes' : 'no';
  return familyMember;
}

function displayFamilySection() {
  var section = document.getElementsByClassName('debug')[0];
  section.style.display = 'block';
  createList(section, 'family_members');
}

function createList(list, id) {
  var ul = document.createElement('ul');
  ul.setAttribute('id', id);
  list.appendChild(ul);
  return ul;
}

function submitFamily() {
  event.preventDefault();
  if (event.target.type == "submit" && (document.getElementById('family_members').children[0].innerHTML != "Make Changes")) {
    makeChangesButton();
  }
  document.getElementsByTagName('button')[0].className += ' submitted';
  //JSON element ready to submit to server
  var familyJSON = JSON.stringify(family);
}

function makeChangesButton() {
  event.preventDefault();
  var list = document.getElementsByClassName('debug')[0].children[0];
  var makeChanges = document.createElement('button');
  makeChanges.innerHTML = 'Make Changes';
  makeChanges.id = "make_changes";
  makeChanges.type = 'button';
  makeChanges.onclick = function() {
    showChangeButtons('remove');
    showChangeButtons('edit');
  }
  list.prepend(makeChanges);
}

function showChangeButtons(option) {
  var option = document.getElementsByClassName(`${option}_button`);
  for (var i in option) {
    option[i].type = 'button';
  }
}

function appendMemberToFamily(familyMember) {
  var person = createList(document.getElementById('family_members'), counter);
  var memberKeys = Object.keys(familyMember);
  personHeader(person);
  appendButtons(person);
  appendAttributes(person, memberKeys, familyMember);
}

function personHeader(person){
  var header = document.createElement('p');
  var listItems = document.getElementById('family_members').children
  for (var i = 0; i < listItems.length; i++) {
    if (listItems[i].nodeName == 'UL') {
      var id = parseInt(listItems[i].id) + 1;
      header.innerHTML = `Family Member #${id}`
    }
  }
  person.appendChild(header);
}

function appendButtons(person) {
  var removeButton = createButton('remove', person.id);
  var editButton = createButton('edit', person.id);
  var saveButton = createButton('save', person.id);
  person.appendChild(removeButton);
  person.appendChild(editButton);
  person.appendChild(saveButton);
  person.appendChild(document.createElement('br'));
}

function appendAttributes(person, memberKeys, familyMember) {
  for (var i = 0; i < memberKeys.length; i++) {
    var newLi = document.createElement('li');
    newLi.innerHTML = memberKeys[i] + ": " + '<span class="attribute">' + familyMember[memberKeys[i]] + '</span>';
    person.appendChild(newLi);
  }
}

function validateFields(age, rel) {
  if (!isNaN(age.to_i) || age == "" || age < 1) {
    alert('Age is required');
  } else if (rel == "") {
    alert('Relationship is required');
  } else {
    return true;
  }
}

function createButton(purpose, id) {
  var element = document.createElement("input");
  element.type = "hidden";
  element.value = `${purpose} family member`;
  element.className = `${purpose}_button`;
  element.onclick = function() {
    if (purpose == 'remove') {
      removeFamilyMember(id);
    } else if (purpose == 'edit') {
      editFamilyMember(id);
    } else if (purpose == 'save') {
      var member = document.getElementById(id).children;
      var age = member[5].getElementsByTagName('span')[0].innerHTML;
      var rel = member[6].getElementsByTagName('span')[0].innerHTML;
      if (!validateFields(age, rel)) {
        editFamilyMember(id);
      }
      document.getElementsByClassName('remove_button')[id].type = 'hidden';
      document.getElementsByClassName('edit_button')[id].type = 'hidden';
      document.getElementsByClassName('save_button')[id].type = 'hidden';
      resetDefaultStyle(id);
      updateFamilyMember(id);
    }
  }
  return element;
}

function resetDefaultStyle(id) {
  var attributes = document.getElementById(id).getElementsByClassName('attribute');
  for (var i = 0; i < attributes.length; i++) {
    attributes[i].style = 'default'
  }
}

function updateFamilyMember(id) {
  var element = document.getElementById(id).children;
  family[id]["age"] = element[5].children[0].innerHTML
  family[id]["rel"] = element[6].children[0].innerHTML
  family[id]["smoker"] = element[7].children[0].innerHTML;
  submitFamily();
}

function removeFamilyMember(id) {
  document.getElementById(id).remove();
  updateList();
}


function updateList() {
  var listItems = document.getElementById('family_members').children;
  if (document.getElementById('family_members').innerHTML.includes('ul')) {
    for (var i = 0; i < listItems.length; i ++) {
      if (listItems[i].nodeName == 'UL') {
        listItems[i].getElementsByTagName('p')[0].innerHTML = `Family Member #${i}`
      }
    }
  } else {
    document.getElementById('make_changes').style.display = 'none';
  }
}

function editFamilyMember(id) {
  var member = document.getElementById(id);
  var editableField = member.getElementsByClassName('attribute');
  for (var i in editableField) {
    editableField[i].style.boxShadow = "2px 2px 2px 0 lightgray inset";
    editableField[i].style.marginTop = "5px";
    editableField[i].style.padding = "2px 3px";
    editableField[i].contentEditable = true;
    document.getElementsByClassName('save_button')[id].type = 'button';
    document.getElementsByClassName('save_button')[id].value = 'Save Changes';
  }
}
