import Komponent from "./komponent";
import Modal from "./modal";
class Bar extends Komponent {
    constructor(options) {
        super(options);
        this.database = options.database;
        this.bar = $$(".bar.hidden")
        this.uploadButton = $$(".bar .inner-bar .add-button");
        this.uploadForm = options.uploadForm;
        this.opened = false;
        this.searchBar = $$(".bar .inner-bar #search-container input");
        this.tags = [];
        this.memesContainer = options.memesContainer
        this.browseButton = $$(".bar .inner-bar button");
        this.browseButton.on('click', () => {
            this.memesContainer.removeMemes();
            setTimeout(() => {
                this.memesContainer.endLoading();
                this.memesContainer.appendMemes();
            }, 2000);
        });
    }

    toggleForm() {
        this.uploadButton.toggleClass("pressed");
        this.uploadForm.toggleContainer();
    }

    toggle() {
        this.file = $$(".content form .blanks .file").val();
        if (!this.file && !this.uploaded) this.opened = false;
        if (this.opened) {
            this.uploadForm.toggleContent();
            setTimeout(() => this.toggleForm(), 80);
            this.opened = false;
        } else {
            this.toggleForm();
            setTimeout(() => {
                this.uploadForm.toggleContent();                
            }, 250);
            this.opened = true;
        }
    }

    removeModal() {
        this.modal.remove();
        this.modal = null;
    }

    handleInput() {
      this.database.once('value', (snapshot) => {
        this.tagStore = {};
        snapshot.forEach((childSnapshot) => {
          const tags = childSnapshot.val().tags;
          tags.forEach(tag => this.tagStore[tag] ? this.tagStore[tag] += 1 : this.tagStore[tag] = 1);
        });
      });
      if (this.searchBar.val().length > 0) {
        if (!this.modal) {
          const options = {
            bar: this,
            searchBar: this.searchBar,
            memesContainer: this.memesContainer,
            tagStore: this.tagStore 
          };
          this.modal = new Modal(options);
          this.modal.render();
        } else {
          this.modal.update();
        }
      } else {
        this.removeModal();
      }
    }

    handleSubmit() {
        this.memesContainer.setHeader(this.searchBar.val());
        this.memesContainer.removeMemes();
        setTimeout(() => {
            this.memesContainer.endLoading();
            this.memesContainer.appendMemes(this.searchBar.val());
        }, 3000);
    }

    render() {
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));
        this.uploadButton.on("click", () => this.toggle());
        this.searchBar.on("input", () => this.handleInput());
        this.searchBar.on("submit", () => this.handleSubmit());
    }
}

export default Bar;