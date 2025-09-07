import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Get user statistics
    const userStats = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_users_7d,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users
      FROM users
    `)

    // Get content statistics
    const contentStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM products WHERE is_featured = true) as featured_products,
        (SELECT COUNT(*) FROM blog_posts) as total_blog_posts,
        (SELECT COUNT(*) FROM blog_posts WHERE is_published = true) as published_posts,
        (SELECT COUNT(*) FROM services) as total_services,
        (SELECT COUNT(*) FROM partners) as total_partners
    `)

    // Get contact form statistics
    const contactStats = await query(`
      SELECT 
        COUNT(*) as total_contacts,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as contacts_30d,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_contacts
      FROM contact_submissions
    `)

    // Get monthly user registrations for chart
    const monthlyUsers = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as users
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `)

    // Get monthly contact submissions for chart
    const monthlyContacts = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as contacts
      FROM contact_submissions 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `)

    // Get blog post statistics by category
    const blogByCategory = await query(`
      SELECT 
        bc.name as category,
        COUNT(bp.id) as posts
      FROM blog_categories bc
      LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.is_published = true
      GROUP BY bc.id, bc.name
      ORDER BY posts DESC
    `)

    return NextResponse.json({
      userStats: userStats.rows[0],
      contentStats: contentStats.rows[0],
      contactStats: contactStats.rows[0],
      monthlyUsers: monthlyUsers.rows,
      monthlyContacts: monthlyContacts.rows,
      blogByCategory: blogByCategory.rows,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
