  // Helper function to display messages below CKEditor 4.
  function ShowMessage(msg) {
    alert(msg);
    // document.getElementById('eMessage').innerHTML = msg;
  }

  function InsertHTML() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;
    var value = document.getElementById('htmlArea').value;

    // Check the active editing mode.
    if (editor.mode == 'wysiwyg') {
      // Insert HTML code.
      // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-insertHtml
      editor.insertHtml(value);
    } else
      alert('You must be in WYSIWYG mode!');
  }

  function InsertText() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;
    var value = document.getElementById('txtArea').value;

    // Check the active editing mode.
    if (editor.mode == 'wysiwyg') {
      // Insert as plain text.
      // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-insertText
      editor.insertText(value);
    } else
      alert('You must be in WYSIWYG mode!');
  }

  function SetContents() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;
    var value = document.getElementById('htmlArea').value;

    // Set editor content (replace current content).
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
    editor.setData(value);
  }

  function GetContents() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;

    // Get editor content.
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-getData
    alert(editor.getData());
  }

  function ExecuteCommand(commandName) {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;

    // Check the active editing mode.
    if (editor.mode == 'wysiwyg') {
      // Execute the command.
      // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-execCommand
      editor.execCommand(commandName);
    } else
      alert('You must be in WYSIWYG mode!');
  }

  function CheckDirty() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;
    // Checks whether the current editor content contains changes when compared
    // to the content loaded into the editor at startup.
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-checkDirty
    alert(editor.checkDirty());
  }

  function ResetDirty() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;
    // Resets the "dirty state" of the editor.
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-resetDirty
    editor.resetDirty();
    alert('The "IsDirty" status was reset.');
  }

  function Focus() {
    // Get the editor instance that you want to interact with.
    var editor = CKEDITOR.instances.editor1;
    // Focuses the editor.
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-focus
    editor.focus();
  }

  // Attaching event listeners to the global CKEDITOR object.
  // The instanceReady event is fired when an instance of CKEditor 4 has finished its initialization.
  CKEDITOR.on('instanceReady', function(ev) {
    ShowMessage('Editor instance <em>' + ev.editor.name + '</em> was loaded.');

    // The editor is ready, so sample buttons can be displayed.
    document.getElementById('eButtons').style.display = 'block';
  });

  // Replace the <textarea id="editor1"> with a CKEditor 4 instance.
  // A reference to the editor object is returned by CKEDITOR.replace() allowing you to work with editor instances.
  // var editor = CKEDITOR.replace('editor', {
  //   height: 150,
  //   removeButtons: 'PasteFromWord'
  // });

  // Attaching event listeners to CKEditor 4 instances.
  // Refer to https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html for a list of all available events.
  // editor.on('focus', function(evt) {
  //   ShowMessage('Editor instance <em>' + this.name + '</em> <b>is focused</b>.');
  // });
  // editor.on('blur', function(evt) {
  //   ShowMessage('Editor instance <em>' + this.name + '</em> <b>lost focus</b>.');
  // });
  // // Helper variable to count the number of detected changes in CKEditor 4.
  // var changesNum = 0;
  // editor.on('change', function(evt) {
  //   ShowMessage('The number of changes in <em>' + this.name + '</em>: <b>' + ++changesNum + '</b>.');
  // });