// preview page for newly created UI components

import Avatar from "@/components/Avatar"
import Skeleton from "@/components/Skeleton"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <section>
        <h3>Skeleton</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </section>

      <section>
        <h3>Avatar</h3>
        <div className="flex gap-4">
          <Avatar name="john" />
          <Avatar name="Alice" />
          <Avatar name="JohnDoe" />
          <Avatar name="AliceBobCarol" />
        </div>
      </section>
    </div>
  )
}
