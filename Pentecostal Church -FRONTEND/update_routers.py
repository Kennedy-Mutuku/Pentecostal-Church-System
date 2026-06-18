import sys

path = 'd:\\CODE CENTRE\\Pentecostal  Church\\Pentecostal Church\\Pentecostal Church -FRONTEND\\src\\pages\\Routers.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const ChairpersonDashboard = lazy(() => import("./ChairpersonDashboard"));',
    'const ChairpersonDashboard = lazy(() => import("./ChairpersonDashboard"));\nconst TreasurerDashboard = lazy(() => import("./TreasurerDashboard"));'
)

content = content.replace(
    '{ path: "/chairperson", element: <ChairpersonDashboard /> },',
    '{ path: "/chairperson", element: <ChairpersonDashboard /> },\n            { path: "/treasurer", element: <TreasurerDashboard /> },'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS")
