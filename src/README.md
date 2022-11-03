# Common v2 magento2 theme for LG OBS

## Description
Commonv2 based theme inheritance from magento blank, we use following modules:

Additional, additional features:
* lg header/footer obs

### Theme
1. Create child theme composer repository:
* default Magento 2 theme files: `theme.xml`, `registration.php`, `composer.json`
* `composer.json` example file:
  ```json
  {
    "name": "vendor/theme-frontend-lg-child-theme",
    "description": "Child frontend theme",
    "type": "magento2-theme",
    "require": {
        "lg/theme-frontend-commonv2": "<latest-version>"
    },
    "autoload": {
        "files": [
            "registration.php"
        ]
    }
  }
  ```
* in `theme.xml` set Commonv2 theme as a parent: `<parent>Lg/common_v2</parent>`

This theme intent/purpose being global for country LG OBS

List countries/theme

* pl_v2 (poland v2) re-design from old theme poland (piloted at the first). Go-live already

Future
* at_v2
* se_v2
* nl_v2
* hu_v2
* cz_v2
* ch_de_v2

remains other countries (re-design in future)

### Structures
####Old way (before restructure)
app/design/frontend/Lg/country_id/Magento_Checkout/web/css/source/layout/_checkout_cart_index.less
app/design/frontend/Lg/country_id/Magento_Checkout/web/css/source/layout/_checkout_index_index.less

All styles mixed/included in one file. Make file size grow frequently. Hard for debug or maintain


####Current approach

Seperate/Isolated to small components

Checkout folders re-structure

app/design/frontend/Lg/common_v2/Magento_Checkout/web/css/source/_extend.less
```less
@import '_mixins';

//SHOPPING CART (Global)
@import 'layout/cart/_styles';

//CHECKOUT (Global)
@import 'layout/checkout-global/_styles'; /* checkout global */
@import 'layout/checkout-threestep/_styles'; /* checkout 3steps */
@import 'layout/checkout-onestep/_styles'; /* checkout 1step */

//CHECKOUT SUCCESS (Global)
@import 'layout/_checkout_onepage_success';

//
//  Minor customisation at child
//  ---------------------------------------------
@import '_extend-child'; /* Styles from theme child */
```
All child theme of commonv2 will inheritance file above and should not override this file

Each files _styles will break down to smaller chucks and include components following approach atomics-design.
Each components will have specific class 

### Customises
Guide for add minor updates/styles from child theme

app/design/frontend/Lg/theme_common_v2_child/Magento_Checkout/web/css/source/_extend-child.less

Copy/Create file above if child theme not have this file

