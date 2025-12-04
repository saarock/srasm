

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps {
  /**
   * The title of the section.
   */
  title: string;

  /**
   * An optional icon to display next to the title.
   */
  icon?: string;
}

/**
 * Props for the SliceButton component.
 */
export interface SliceButtonProps {
  /**
   * The label text to display on the button.
   */
  label: string;

  /**
   * The color theme for the button.
   */
  color: string;

  /**
   * Callback function triggered when the button is clicked.
   */
  onClick: () => void;

  /**
   * The visual variant of the button.
   * Defaults to "solid".
   */
  variant?: "solid" | "outline";
}

/**
 * Props for the SliceDisplay component.
 */
export interface SliceDisplayProps {
  /**
   * The title of the slice being displayed.
   */
  title: string;

  /**
   * The data object to display.
   */
  data: any;

  /**
   * The accent color for the display card.
   */
  accentColor: string;
}
