import "../css/style.scss";

// Our modules / classes
import MobileMenu from "./modules/MobileMenu";
import HeroSlider from "./modules/HeroSlider";
import Search from "./modules/search";
import MyNotes from "./modules/MyNotes";

$ = jQuery.noConflict();

// Instantiate a new object using our modules/classes
const mobileMenu = new MobileMenu();
const heroSlider = new HeroSlider();
const search = new Search();
const notes = new MyNotes();
