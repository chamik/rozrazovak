using CSV, JSON, DataFrames

fr = CSV.read(ARGS[1], DataFrame; header=false)
filtered = Dict{String, Set}()
for name in names(fr)
    column = fr[:, name]
    header = column[1]

    if haskey(filtered, header) continue end
    s = Set()

    for r in column[2:end]
        push!(s, r)
    end

    filtered[header] = s
end

json_string = JSON.json(filtered)

open("out.json","w") do f
    JSON.print(f, json_string)
  end