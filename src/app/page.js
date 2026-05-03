export default async function Home() {
  const res = await fetch(
    'https://my-strapi-app-1-y20s.onrender.com/api/categories',
    { cache: 'no-store' }
  );

  const data = await res.json();

  const categories = data.data || [];

  return (
    <div>
      <h1>Categories</h1>

      {categories.length === 0 ? (
        <p>No data found</p>
      ) : (
        categories.map((item) => (
          <p key={item.id}>
            {item.name || item.attributes?.name}
          </p>
        ))
      )}
    </div>
  );
}