import {
  ElInput,
  ElTooltip,
  ElEmpty,
  ElDialog,
  ElNotification,
  ElInputNumber,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  ElInfiniteScroll,
  ElSelect,
  ElOption,
  ElPagination,
  ElCarousel,
  ElCarouselItem,
} from "element-plus";

const EleUI = [
  ElInput,
  ElTooltip,
  ElEmpty,
  ElDialog,
  ElNotification,
  ElInputNumber,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  ElInfiniteScroll,
  ElSelect,
  ElOption,
  ElPagination,
  ElCarousel,
  ElCarouselItem,
];

export default (app) => {
  EleUI.forEach((ui) => app.use(ui));
};
