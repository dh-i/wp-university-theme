import axios from "axios";

class MyNotes {
  constructor() {
    if (document.querySelector("#my-notes")) {
      axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce;
      this.myNotes = document.querySelector("#my-notes");
      this.events();
    }
  }

  events() {
    this.myNotes.addEventListener("click", (e) => this.clickHandler(e));
    document
      .querySelector(".submit-note")
      .addEventListener("click", () => this.createNote());
  }

  clickHandler(e) {
    if (
      e.target.classList.contains("delete-note") ||
      e.target.classList.contains("fa-trash-o")
    )
      this.deleteNote(e);
    if (
      e.target.classList.contains("edit-note") ||
      e.target.classList.contains("fa-pencil") ||
      e.target.classList.contains("fa-times")
    )
      this.editNote(e);
    if (
      e.target.classList.contains("update-note") ||
      e.target.classList.contains("fa-arrow-right")
    )
      this.updateNote(e);
  }

  findNearestParentLi(el) {
    let thisNote = el;
    while (thisNote.tagName != "LI") {
      thisNote = thisNote.parentElement;
    }
    return thisNote;
  }

  // Methods will go here
  editNote(e) {
    const thisNote = this.findNearestParentLi(e.target);

    if (thisNote.getAttribute("data-state") == "editable") {
      this.makeNoteReadOnly(thisNote);
    } else {
      this.makeNoteEditable(thisNote);
    }
  }

  makeNoteEditable(thisNote) {
    thisNote.querySelector(".edit-note").innerHTML =
      '<i class="fa fa-times" aria-hidden="true"></i> Cancel';
    thisNote.querySelector(".note-title-field").removeAttribute("readonly");
    thisNote.querySelector(".note-body-field").removeAttribute("readonly");
    thisNote
      .querySelector(".note-title-field")
      .classList.add("note-active-field");
    thisNote
      .querySelector(".note-body-field")
      .classList.add("note-active-field");
    thisNote
      .querySelector(".update-note")
      .classList.add("update-note--visible");
    thisNote.setAttribute("data-state", "editable");
  }

  makeNoteReadOnly(thisNote) {
    thisNote.querySelector(".edit-note").innerHTML =
      '<i class="fa fa-pencil" aria-hidden="true"></i> Edit';
    thisNote
      .querySelector(".note-title-field")
      .setAttribute("readonly", "true");
    thisNote.querySelector(".note-body-field").setAttribute("readonly", "true");
    thisNote
      .querySelector(".note-title-field")
      .classList.remove("note-active-field");
    thisNote
      .querySelector(".note-body-field")
      .classList.remove("note-active-field");
    thisNote
      .querySelector(".update-note")
      .classList.remove("update-note--visible");
    thisNote.setAttribute("data-state", "cancel");
  }

  async deleteNote(e) {
    const thisNote = this.findNearestParentLi(e.target);

    try {
      const response = await axios.delete(
        universityData.root_url +
          "/wp-json/wp/v2/note/" +
          thisNote.getAttribute("data-id")
      );
      thisNote.style.height = `${thisNote.offsetHeight}px`;
      setTimeout(function () {
        thisNote.classList.add("fade-out");
      }, 20);
      setTimeout(function () {
        thisNote.remove();
      }, 401);
      if (response.data.userNoteCount < 5) {
        document
          .querySelector(".note-limit-message")
          .classList.remove("active");
      }
    } catch (e) {
      console.log("Sorry");
    }
  }

  async updateNote(e) {
    const thisNote = this.findNearestParentLi(e.target);

    var ourUpdatedPost = {
      title: thisNote.querySelector(".note-title-field").value,
      content: thisNote.querySelector(".note-body-field").value,
    };

    try {
      const response = await axios.post(
        universityData.root_url +
          "/wp-json/wp/v2/note/" +
          thisNote.getAttribute("data-id"),
        ourUpdatedPost
      );
      this.makeNoteReadOnly(thisNote);
    } catch (e) {
      console.log("Sorry");
    }
  }

  async createNote() {
    var ourNewPost = {
      title: document.querySelector(".new-note-title").value,
      content: document.querySelector(".new-note-body").value,
      status: "publish",
    };

    try {
      const response = await axios.post(
        universityData.root_url + "/wp-json/wp/v2/note/",
        ourNewPost
      );

      if (response.data != "You have reached your note limit.") {
        document.querySelector(".new-note-title").value = "";
        document.querySelector(".new-note-body").value = "";
        document.querySelector("#my-notes").insertAdjacentHTML(
          "afterbegin",
          ` <li data-id="${response.data.id}" class="fade-in-calc">
            <input readonly class="note-title-field" value="${response.data.title.raw}">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field">${response.data.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>`
        );

        // notice in the above HTML for the new <li> I gave it a class of fade-in-calc which will make it invisible temporarily so we can count its natural height

        let finalHeight; // browser needs a specific height to transition to, you can't transition to 'auto' height
        let newlyCreated = document.querySelector("#my-notes li");

        // give the browser 30 milliseconds to have the invisible element added to the DOM before moving on
        setTimeout(function () {
          finalHeight = `${newlyCreated.offsetHeight}px`;
          newlyCreated.style.height = "0px";
        }, 30);

        // give the browser another 20 milliseconds to count the height of the invisible element before moving on
        setTimeout(function () {
          newlyCreated.classList.remove("fade-in-calc");
          newlyCreated.style.height = finalHeight;
        }, 50);

        // wait the duration of the CSS transition before removing the hardcoded calculated height from the element so that our design is responsive once again
        setTimeout(function () {
          newlyCreated.style.removeProperty("height");
        }, 450);
      } else {
        document.querySelector(".note-limit-message").classList.add("active");
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default MyNotes;
