import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageZoom } from "./ImageZoom";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export const ProductImageCarousel = ({ images, productName }: ProductImageCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image Display with Zoom */}
      <div className="aspect-square overflow-hidden rounded-lg bg-muted border border-border shadow-lg">
        <ImageZoom
          src={images[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className="aspect-square"
        />
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/4 md:basis-1/5 lg:basis-1/6">
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-md bg-muted border-2 transition-all hover:border-primary",
                    selectedIndex === index
                      ? "border-primary shadow-md ring-2 ring-primary/20"
                      : "border-border hover:shadow-sm"
                  )}
                >
                  <img
                    src={image}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 4 && (
            <>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
};
