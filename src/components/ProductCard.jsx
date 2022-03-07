import {Image, Link} from '@shopify/hydrogen';

import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */
export default function ProductCard({product}) {
  const selectedVariant = product.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  return (
    <div className="text-md mb-4 relative">
      <Link to={`/products/${product.handle}`}>
        <div className="rounded-lg border-2 border-gray-200 mb-2 relative flex items-center justify-center overflow-hidden object-cover h-96">
          {selectedVariant.image ? (
            <Image
              className="bg-white absolute w-full h-full transition-all duration-500 ease-in-out transform bg-center bg-cover object-center object-contain hover:scale-110"
              image={selectedVariant.image}
            />
          ) : null}
          {!selectedVariant?.availableForSale && (
            <div className="absolute top-3 left-3 rounded-3xl text-xs bg-black text-white py-3 px-4">
              Out of stock
            </div>
          )}
        </div>

        <span className="text-black font-semibold mb-0.5">{product.title}</span>

        {product.vendor && (
          <p className="text-gray-900 font-medium text-sm mb-0.5">
            {product.vendor}
          </p>
        )}

        <div className="flex ">
          {selectedVariant.compareAtPriceV2 && (
            <MoneyCompareAtPrice money={selectedVariant.compareAtPriceV2} />
          )}
          <MoneyPrice money={selectedVariant.priceV2} />
        </div>
      </Link>
    </div>
    <a href="{{ product.url | within: collection }}" data-productid="{{ product.id }}" data-producth="{{ product.handle }}"
  data-add="{{ " wishlist.buttons_text.tooltip_add" | t }}" data-remove="{{ " wishlist.buttons_text.tooltip_remove" | t
  }}" data-tooltip="{% if customer.id == blank %}{{ " wishlist.buttons_text.tooltip_login" | t }}{% else %}{% if wl_text
  %}{{ "wishlist.buttons_text.tooltip_remove" | t }}{% else %}{{ "wishlist.buttons_text.tooltip_add" | t }}{% endif %}{%
  endif %}" data-tposition="left" data-type="wishlist"
  data-action="{% if wl_text %}wk-remove{% else %}wk-add{% endif %}"
  class="wk-app-btn tt-btn-wishlist wlbutton-js{% if template.suffix == " wishlist" %} wk-delete-icon{% endif %}">
  {% if template.suffix == "wishlist" %}<i class="far fa-trash-alt"></i>
  {% else %}<i class="far fa-heart"></i>
  {% endif %}
</a>
  );
}
