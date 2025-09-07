import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(`
      SELECT bp.*, bc.name as category_name, u.name as author_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.is_published = true
      ORDER BY bp.published_date DESC, bp.created_at DESC
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, excerpt, content, image_path, category_id, author_id, published_date, is_published } = body

    const result = await query(
      `INSERT INTO blog_posts (slug, title, excerpt, content, image_path, category_id, author_id, published_date, is_published) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [slug, title, excerpt, content, image_path, category_id, author_id, published_date, is_published],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
