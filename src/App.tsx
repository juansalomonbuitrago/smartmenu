import { useMemo, useState } from 'react' // hola.
import { ChevronLeft, ChevronRight, CircleHelp, FileUp, Heart, Leaf, Menu, Plus, Settings, ShoppingBasket, Sparkles, Star, X, AlertTriangle, Activity } from 'lucide-react'

// 1 & 2. Actualización de tipos para incluir alérgenos y nutrición
type Nutrition = { kcal: number; protein: number; carbs: number; fat: number; sugar: number }
type Recipe = { name: string; category: string; time: string; cost: number; color: string; ingredients: string[]; rating: number; allergens: string[]; nutrition: Nutrition }

// Base de datos de recetas actualizada con alérgenos y nutrición
const recipes: Recipe[] = [
  { name: 'Bowl mediterráneo', category: 'Fresco y ligero', time: '25 min', cost: 8.4, color: 'mint', rating: 5, ingredients: ['Quinoa · 120 g', 'Tomate cherry · 180 g', 'Pepino · 1 unidad', 'Hummus · 80 g'], allergens: ['Sésamo'], nutrition: { kcal: 420, protein: 12, carbs: 55, fat: 18, sugar: 4 } },
  { name: 'Tacos de pollo', category: 'Favorito familiar', time: '30 min', cost: 9.8, color: 'peach', rating: 5, ingredients: ['Tortillas · 6 unidades', 'Pechuga de pollo · 300 g', 'Aguacate · 1 unidad', 'Lima · 2 unidades'], allergens: ['Gluten'], nutrition: { kcal: 550, protein: 35, carbs: 45, fat: 22, sugar: 3 } },
  { name: 'Pasta primavera', category: 'Vegetariano', time: '20 min', cost: 6.7, color: 'lavender', rating: 4, ingredients: ['Pasta integral · 250 g', 'Calabacín · 1 unidad', 'Pimiento rojo · 1 unidad', 'Parmesano · 40 g'], allergens: ['Gluten', 'Lácteos'], nutrition: { kcal: 480, protein: 18, carbs: 68, fat: 14, sugar: 6 } },
  { name: 'Lentejas caseras', category: 'De cuchara', time: '45 min', cost: 5.2, color: 'sage', rating: 5, ingredients: ['Lentejas · 250 g', 'Zanahoria · 2 unidades', 'Patata · 2 unidades', 'Pimentón · 1 cucharadita'], allergens: [], nutrition: { kcal: 390, protein: 22, carbs: 60, fat: 5, sugar: 4 } },
  { name: 'Salmón al horno', category: 'Rico en omega 3', time: '35 min', cost: 12.6, color: 'blue', rating: 4, ingredients: ['Salmón · 2 lomos', 'Brócoli · 300 g', 'Limón · 1 unidad', 'Ajo · 2 dientes'], allergens: ['Pescado'], nutrition: { kcal: 460, protein: 42, carbs: 10, fat: 28, sugar: 2 } },
  { name: 'Crema de calabaza', category: 'Suave y reconfortante', time: '35 min', cost: 4.9, color: 'yellow', rating: 5, ingredients: ['Calabaza · 600 g', 'Cebolla · 1 unidad', 'Nata · 100 ml', 'Nuez moscada · al gusto'], allergens: ['Lácteos'], nutrition: { kcal: 320, protein: 5, carbs: 30, fat: 20, sugar: 12 } },
  { name: 'Arroz tres delicias', category: 'Fácil y completo', time: '25 min', cost: 7.3, color: 'peach', rating: 4, ingredients: ['Arroz · 250 g', 'Guisantes · 100 g', 'Huevos · 2 unidades', 'Jamón cocido · 100 g'], allergens: ['Huevo', 'Soja'], nutrition: { kcal: 510, protein: 20, carbs: 70, fat: 15, sugar: 3 } },
]
const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const calendarStart = new Date(Date.UTC(2026, 8, 28))
const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' })

// 3. Mapeo de colores más vivos con degradados
const colorStyles: Record<string, string> = {
  mint: 'bg-gradient-to-br from-emerald-100 to-emerald-300 text-emerald-900 ring-emerald-400',
  peach: 'bg-gradient-to-br from-orange-100 to-orange-300 text-orange-900 ring-orange-400',
  lavender: 'bg-gradient-to-br from-purple-100 to-purple-300 text-purple-900 ring-purple-400',
  sage: 'bg-gradient-to-br from-lime-100 to-lime-300 text-lime-900 ring-lime-400',
  blue: 'bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 ring-blue-400',
  yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-300 text-yellow-900 ring-yellow-400',
}

export default function App() {
  const [week, setWeek] = useState(1)
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [inflation, setInflation] = useState(3)
  const [notice, setNotice] = useState('')
  
  // 5. Memorización para optimizar rendimiento
  const weekRecipes = useMemo(() => Array.from({ length: 5 }, (_, i) => recipes[(week - 1) * 5 + i] ?? recipes[(i + week * 2) % recipes.length]), [week])
  const weekDates = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const date = new Date(calendarStart)
    date.setUTCDate(calendarStart.getUTCDate() + (week - 1) * 7 + i)
    return date
  }), [week])
  const monthly = weekRecipes.reduce((sum, recipe) => sum + recipe.cost * (1 + inflation / 100), 0)

  function showNotice(text: string) { setNotice(text); window.setTimeout(() => setNotice(''), 2600) }

  return <main className="min-h-screen bg-[#f8faf8] text-[#17251f]">
    {/* Header se mantiene igual */}
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
      <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-[#183c32] text-white shadow-sm"><Leaf /></div><div><p className="text-lg font-bold tracking-tight">SmartMenu</p><p className="text-xs text-[#75837c]">Tu semana, más sencilla</p></div></div>
      <nav className="hidden items-center gap-7 text-sm font-medium text-[#68766f] md:flex"><button className="text-[#183c32]">Mi menú</button><button onClick={() => setShowSettings(true)} className="flex items-center gap-2 hover:text-[#183c32]"><Settings size={16}/> Ajustes</button><button className="flex items-center gap-2 hover:text-[#183c32]"><CircleHelp size={16}/> Ayuda</button></nav>
      <button aria-label="Abrir menú" onClick={() => setShowSettings(true)} className="rounded-xl p-2 md:hidden"><Menu /></button>
    </header>

    <section className="mx-auto max-w-7xl px-5 pb-10 pt-4 lg:px-10 lg:pt-12">
      <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e6f3ed] px-3 py-1.5 text-xs font-semibold text-[#32725b]"><Sparkles size={14}/> Plan inteligente</div><h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-5xl">Menú de Comidas</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[#74817b]">Cinco semanas de comidas variadas, equilibradas y pensadas para disfrutar en familia sin repetir platos.</p></div><button onClick={() => showNotice('¡Lista de compra preparada!')} className="flex items-center justify-center gap-2 rounded-2xl bg-[#27356f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#27356f]/15 transition hover:bg-[#1d2857]"><ShoppingBasket size={18}/> Ver lista de compra</button></div>
      
      {/* Botones de semana con colores fuertes y hover */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => {setWeek(n);setSelected(null)}} 
            className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${week === n ? 'bg-gradient-to-r from-[#27356f] to-[#3a4b8f] text-white shadow-lg shadow-[#27356f]/30' : 'bg-white text-[#809088] ring-1 ring-[#e2e9e4] hover:shadow-md hover:text-[#27356f]'}`}>
            Semana {n}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold">Semana {week}</h2><p className="mt-1 text-sm text-[#819089]">Del {dateFormatter.format(weekDates[0])} al {dateFormatter.format(weekDates[4])}</p></div><div className="flex gap-2"><button className="grid size-9 place-items-center rounded-xl bg-white text-[#738078] ring-1 ring-[#e2e9e4]" onClick={() => setWeek(Math.max(1, week-1))}><ChevronLeft size={18}/></button><button className="grid size-9 place-items-center rounded-xl bg-white text-[#738078] ring-1 ring-[#e2e9e4]" onClick={() => setWeek(Math.min(5, week+1))}><ChevronRight size={18}/></button></div></div>
      
      {/* 4. Despliegue de comidas por semana */}
      <div className="grid gap-4 md:grid-cols-5">
        {weekdays.map((day, index) => { 
          const recipe = weekRecipes[index]; 
          return (
            <button key={day} onClick={() => setSelected(recipe)} className="group text-left flex flex-col h-full">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-700">{day}</span>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-xs font-medium text-[#809088] ring-1 ring-[#e2e9e4]">{String(weekDates[index].getUTCDate()).padStart(2, '0')}</span>
              </div>
              <div className={`flex-1 relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl ring-1 shadow-sm ${colorStyles[recipe.color]}`}>
                <div>
                  <div className="flex justify-between items-start">
                    <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-gray-800 shadow-sm">{recipe.category}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold leading-tight drop-shadow-sm">{recipe.name}</h3>
                  
                  {/* 1. Mostrar Alérgenos en la tarjeta */}
                  {recipe.allergens.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {recipe.allergens.map(a => (
                        <span key={a} className="inline-flex items-center gap-1 rounded bg-red-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-red-800 backdrop-blur-sm"><AlertTriangle size={10}/> {a}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-semibold bg-white/40 p-2 rounded-xl backdrop-blur-sm">
                  <span className="flex items-center gap-1"><Activity size={14}/> {recipe.nutrition.kcal} kcal</span>
                  <span className="font-bold">{(recipe.cost * (1 + inflation/100)).toFixed(2)} €</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>

    {/* Modal de Detalle con Nutrición */}
    {selected && (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17251f]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6 transition-opacity" onClick={() => setSelected(null)}>
        <div role="dialog" aria-modal="true" aria-label={selected.name} onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8 overflow-y-auto max-h-[90vh]">
          <div className="flex items-start justify-between mb-4">
            <div><p className="text-xs font-bold uppercase tracking-wider text-[#56806c]">{selected.category}</p><h2 className="mt-1 text-2xl font-bold">{selected.name}</h2></div>
            <button aria-label="Cerrar" onClick={() => setSelected(null)} className="grid size-9 place-items-center rounded-full bg-gray-100 hover:bg-gray-200 transition"><X size={18}/></button>
          </div>
          
          {/* 2. Desglose Nutricional (Estilo imagen negra) */}
          <div className="rounded-2xl bg-[#111111] p-5 text-white my-6 shadow-inner">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">TOTAL ACUMULADO</h3>
            <div className="text-3xl font-bold mb-4">≈{selected.nutrition.kcal} kcal</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2"><span className="flex items-center gap-2">🥩 Proteína</span> <span>≈{selected.nutrition.protein} g</span></div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-2"><span className="flex items-center gap-2">🍞 Carbohidratos</span> <span>≈{selected.nutrition.carbs} g</span></div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-2"><span className="flex items-center gap-2">🥑 Grasas</span> <span>≈{selected.nutrition.fat} g</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2">🍬 Azúcares</span> <span>≈{selected.nutrition.sugar} g</span></div>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-bold mt-4">Ingredientes y Coste</h3>
          <ul className="grid grid-cols-2 gap-3 text-sm text-[#607168]">
            {selected.ingredients.map(item => <li key={item} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#53a17d]"/>{item}</li>)}
          </ul>
          
          <button onClick={() => showNotice('Plato añadido a favoritos')} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#183c32] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f251f]"><Heart size={17}/> Guardar en favoritos</button>
        </div>
      </div>
    )}
    
    {/* Ajustes y Notificaciones (Sin cambios significativos, heredados del original) */}
    {showSettings && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17251f]/30 p-5 backdrop-blur-sm" onClick={() => setShowSettings(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#56806c]">Configuración</p><h2 className="mt-1 text-2xl font-bold">Ajustes de costes</h2></div><button aria-label="Cerrar ajustes" onClick={() => setShowSettings(false)} className="grid size-9 place-items-center rounded-full bg-[#f1f5f2]"><X size={18}/></button></div><div className="mt-7 rounded-2xl bg-[#f5f8f5] p-4"><div className="flex items-center justify-between"><label htmlFor="inflation" className="text-sm font-semibold">Inflación aplicada</label><span className="rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-[#1c7358]">{inflation}%</span></div><input id="inflation" type="range" min="0" max="15" value={inflation} onChange={e => setInflation(Number(e.target.value))} className="mt-5 w-full accent-[#1c7358]"/><div className="mt-2 flex justify-between text-[11px] text-[#87958d]"><span>Sin inflación</span><span>15% máximo</span></div></div><div className="mt-4 rounded-2xl border border-dashed border-[#cddbd2] p-5 text-center"><FileUp className="mx-auto text-[#4d9a78]"/><p className="mt-2 text-sm font-semibold">Actualizar banco de ingredientes</p><p className="mt-1 text-xs text-[#819089]">Importa un CSV o JSON con tus precios</p><label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#e6f3ed] px-4 py-2.5 text-xs font-bold text-[#32725b]"><Plus size={15}/> Elegir archivo<input type="file" accept=".csv,.json" className="sr-only" onChange={() => showNotice('Archivo listo para importar')}/></label></div></div></div>}
    {notice && <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-[#183c32] px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}
  </main>
}



