import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const result = await query(
      `
      SELECT bp.*, bc.name as category_name, u.name as author_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.slug = $1 AND bp.is_published = true
    `,
      [params.slug],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()
    const { title, excerpt, content, image_path, category_id, published_date, is_published } = body

    const result = await query(
      `UPDATE blog_posts 
       SET title = $1, excerpt = $2, content = $3, image_path = $4, category_id = $5, 
           published_date = $6, is_published = $7, updated_at = CURRENT_TIMESTAMP
       WHERE slug = $8 RETURNING *`,
      [title, excerpt, content, image_path, category_id, published_date, is_published, params.slug],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const result = await query("DELETE FROM blog_posts WHERE slug = $1 RETURNING *", [params.slug])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
