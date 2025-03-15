
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subcategoria</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">% do Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subcategoryData.map((item) => (
                          <TableRow key={item.category.id}>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell className="text-right tabular-nums">
                              {showValues ? formatCurrency(item.amount) : "•••••••"}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {showValues ? `${item.percentage.toFixed(2)}%` : "•••••••"}
                            </TableCell>
                            <TableCell>
                              <CompareButton 
                                onClick={() => handleAddToComparison(item.category.id, `${selectedCategoryName} > ${item.category.name}`)}
                                categoryId={item.category.id}
                                categoryPath={`${selectedCategoryName} > ${item.category.name}`}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell>TOTAL</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {showValues ? formatCurrency(totalAmount) : "•••••••"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {showValues ? "100%" : "•••••••"}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
