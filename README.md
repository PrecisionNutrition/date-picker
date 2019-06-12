date-picker
==============================================================================

First there was [shared-ember-components](https://github.com/PrecisionNutrition/shared-ember-components), Graham spoketh "This is crazy. Every time I touch a component's style, we have to update everything." And so `{{date-picker` was extracted, and so shall all of the other components.

Installation
------------------------------------------------------------------------------

You should reopen the `DatePicker` service and override `isNativePickerDisplayed`. This controls whether or not we display a native `<input`, or the fancy picker.

But Why This?
------------------------------------------------------------------------------

Whilst we wait for more desktop browsers to actually support date `<input`s with
a built in picker, we have to resort to building one for ourselves. This component
falls back to native datepickers for mobile browsers.
