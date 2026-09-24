// Copyright Advanced Micro Devices, Inc.
//
// SPDX-License-Identifier: MIT

/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Explicit declarations to safely resolve binary image pathways within alias imports
declare module "*.png" {
  const content: import("next/dist/shared/lib/image-external").StaticImageData;
  export default content;
}

declare module "*.jpg" {
  const content: import("next/dist/shared/lib/image-external").StaticImageData;
  export default content;
}

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
