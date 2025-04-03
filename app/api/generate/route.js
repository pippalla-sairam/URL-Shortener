import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("bitlinks");
    const collection = db.collection("url");

    // Check if the short URL already exists
    const existingDoc = await collection.findOne({ shorturl: body.shorturl });

    if (existingDoc) {
      return Response.json(
        { success: false, error: true, message: "URL already exists!" },
        { status: 400 }
      );
    }

    // Insert new URL mapping
    await collection.insertOne({
      url: body.url,
      shorturl: body.shorturl,
    });

    return Response.json(
      { success: true, error: false, message: "URL Generated Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return Response.json(
      { success: false, error: true, message: "Server error" },
      { status: 500 }
    );
  }
}
