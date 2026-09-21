// preview page for newly created UI components

import Skeleton from "@/components/Skeleton"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}
