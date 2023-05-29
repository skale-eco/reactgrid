import {
  ChevronCellTemplate,
  TimeCellTemplate,
  EmailCellTemplate,
  DateCellTemplate,
  CheckboxCellTemplate,
  HeaderCellTemplate,
  NumberCellTemplate,
  TextCellTemplate,
  DropdownCellTemplate,
  HeaderCellTemplateCustom,
  TextCellTemplateCustom,
  ButtonCellTemplate,
  EmailCellTemplateCustom,
} from "../CellTemplates";
import { CellTemplates } from "../Model/PublicModel";

export const defaultCellTemplates: CellTemplates = {
  text: new TextCellTemplate(),
  number: new NumberCellTemplate(),
  header: new HeaderCellTemplate(),
  checkbox: new CheckboxCellTemplate(),
  date: new DateCellTemplate(),
  email: new EmailCellTemplate(),
  time: new TimeCellTemplate(),
  chevron: new ChevronCellTemplate(),
  dropdown: new DropdownCellTemplate(),

  //Custom
  "header-custom": new HeaderCellTemplateCustom(),
  "text-custom": new TextCellTemplateCustom(),
  button: new ButtonCellTemplate(),
  'email-custom': new EmailCellTemplateCustom(),
};
