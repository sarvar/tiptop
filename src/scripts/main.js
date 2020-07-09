function modalWindows() {
  document.addEventListener("click", (e) => {
    let toggledElem = e.target.closest("[data-modal-toggle]");
    if (toggledElem) {
      toggle(toggledElem.dataset.modalToggle);
      event.preventDefault();
    }

    let closedElem = e.target.closest("[data-modal-close]");
    if (closedElem) {
      close(document.getElementById(closedElem.dataset.modalClose));
      event.preventDefault();
    }
  });

  function toggle(id) {
    let modal = document.getElementById(id);
    if (!modal.classList.contains("opened")) {
      open(modal);
    } else {
      close(modal);
    }
  }

  function open(modal) {
    let event = new CustomEvent("modalopened", {
      bubbles: true,
    });
    document.body.style.paddingRight = getScrollerWidth() + 'px';
    document.querySelector(".header")
      .style.paddingRight = getScrollerWidth() + "px";
    document.body.style.overflow = "hidden";
    modal.classList.add("block");
    setTimeout(() => modal.classList.add('opened'), 40);
    modal.dispatchEvent(event);
  }

  function close(modal) {
    modal.classList.remove('opened');
    modal.addEventListener("transitionend", () => {
      document.body.style.paddingRight = '';
      document.querySelector(".header")
        .style.paddingRight = "";
      document.body.style.overflow = "";
      modal.classList.remove("block");
    }, {
      once: true
    });
  }
}

function animate() {
  window.addEventListener("load", () => {
    let items = document.querySelectorAll("[data-to-animate]");
    items.forEach(item => {
      let coords = item.getBoundingClientRect();
      let position = pageYOffset + coords.top;
      checkVisibility(item, () => {
        item.classList.add("animate");
      });
      window.addEventListener("scroll", function anim() {
        // if(pageYOffset >= position) {
        //   item.classList.add("animate");
        //   window.removeEventListener("scroll", anim);
        // }
        checkVisibility(item, () => {
          item.classList.add("animate");
          window.removeEventListener("scroll", anim);
        });
      });
    });
  });

  function checkVisibility(item, func) {
    let coords = item.getBoundingClientRect();
    // let condition1 = pageYOffset >= position || pageYOffset - document.clientHeight >= position;
    let condition2 = coords.top <= document.documentElement.clientHeight - 300;
    if (condition2) {
      func();
    }
  }
}

// menu search1
var x = document.getElementsByClassName("open_close_menu_search");
var i;
for (i = 0; i < x.length; i++) {
  x[i].addEventListener("click", myFunction);

  function myFunction() {
    var elementMenu = document.getElementsByClassName("menu_search_block")[0];
    elementMenu.classList.toggle("open");
  }
}

// modal
var x = document.getElementsByClassName("open_close_modal");
var i;
for (i = 0; i < x.length; i++) {
  x[i].addEventListener("click", myFunction);

  function myFunction() {
    var elementMenu = document.getElementsByClassName("modal")[0];
    var bodyMain2 = document.getElementsByClassName('page')[0];
    elementMenu.classList.toggle("open");
    bodyMain2.classList.toggle('over-hidden')
  }
}

modalWindows();